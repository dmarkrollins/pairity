/* global Tournaments TIU Divisions */
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import fs from 'fs'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import { $ } from 'meteor/jquery';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector'
import { TestData } from '../../testData'
import { Pairity, Teams, TeamMembers, Organizations, OrganizationMembers } from '../../../imports/lib/pairity'

const should = chai.should();

if (Meteor.isServer) {
    import '../../../imports/server/publications/publication-teams'

    describe('Publication - Teams', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            Teams.remove({})
            Organizations.remove({})
            OrganizationMembers.remove({})
        });

        it('SingleTeam', function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            const team = TestData.fakeTeam()

            const id = Teams.insert(team)

            const collector = new PublicationCollector()

            collector.collect('singleTeam', id, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { teams } = collections
                try {
                    expect(teams).to.have.length(1)
                } catch (err) {
                    done(err)
                }
                done();
            });
        })


        it('default limit is pairity default limit', function (done) {
            const userid = Random.id()
            sandbox.stub(Meteor, 'userId').returns(userid)

            // of the teams belonging to the org I belong, only return teams I am a member of
            // I can be a member of more than one team

            // create an org
            const org = TestData.fakeOrganization()
            const orgid = Organizations.insert(org)

            const orgMember = TestData.fakeOrganizationMember({ organizationId: orgid, userId: userid })
            const memberId = OrganizationMembers.insert(orgMember)

            for (let i = 0; i < 12; i += 1) {
                const teamid = Teams.insert(TestData.fakeTeam({ organizationId: orgid, name: `test team ${i}` }))
                TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: userid }))
            }

            const collector = new PublicationCollector()

            collector.collect('allTeams', {}, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { teams } = collections
                try {
                    expect(teams).to.have.length(Pairity.defaultLimit)
                } catch (err) {
                    done(err)
                }
                done();
            });
        })

        it('use limit provided to limit how many teams are returned', function (done) {
            const userid = Random.id()
            sandbox.stub(Meteor, 'userId').returns(userid)

            // of the teams belonging to the org I belong, only return teams I am a member of
            // I can be a member of more than one team

            // create an org
            const org = TestData.fakeOrganization()
            const orgid = Organizations.insert(org)

            const orgMember = TestData.fakeOrganizationMember({ organizationId: orgid, userId: userid })
            const memberId = OrganizationMembers.insert(orgMember)


            for (let i = 0; i < 10; i += 1) {
                const teamid = Teams.insert(TestData.fakeTeam({ organizationId: orgid, name: `test team ${i}` }))
                TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: userid }))
            }

            const collector = new PublicationCollector()

            const search = { limit: 2, name: '' }

            collector.collect('allTeams', search, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { teams } = collections
                try {
                    expect(teams).to.have.length(2)
                } catch (err) {
                    done(err)
                }
                done();
            });
        })

        it('search name filters list of teams returned', function (done) {
            const userid = Random.id()
            sandbox.stub(Meteor, 'userId').returns(userid)

            // of the teams belonging to the org I belong, only return teams I am a member of
            // I can be a member of more than one team

            // create an org
            const org = TestData.fakeOrganization()
            const orgid = Organizations.insert(org)

            const orgMember = TestData.fakeOrganizationMember({ organizationId: orgid, userId: userid })
            const memberId = OrganizationMembers.insert(orgMember)

            for (let i = 0; i < 10; i += 1) {
                const teamid = Teams.insert(TestData.fakeTeam({ organizationId: orgid, name: `test team ${i}` }))
                TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: userid }))
            }

            const collector = new PublicationCollector()

            const search = { limit: 2, name: '3' }

            collector.collect('allTeams', search, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { teams } = collections
                try {
                    expect(teams).to.have.length(1)
                    expect(teams[0].name).to.equal('test team 3')
                } catch (err) {
                    done(err)
                }
                done();
            });
        })


        it('return teams I am a member of', function (done) {
            const userid = Random.id()
            sandbox.stub(Meteor, 'userId').returns(userid)

            const adminids = []
            adminids.push(Random.id())

            // create an org
            const org = TestData.fakeOrganization({ admins: adminids })
            const orgid = Organizations.insert(org)

            const orgMember = TestData.fakeOrganizationMember({ organizationId: orgid, userId: userid })
            const memberId = OrganizationMembers.insert(orgMember)

            for (let i = 0; i < 10; i += 1) {
                const teamid = Teams.insert(TestData.fakeTeam({ organizationId: orgid, name: `test team ${i}` }))
                if (i < 5) {
                    TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: userid }))
                } else {
                    TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: Random.id() }))
                }
            }

            const collector = new PublicationCollector()

            collector.collect('allTeams', {}, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { teams } = collections
                try {
                    expect(teams).to.have.length(5)
                } catch (err) {
                    done(err)
                }
                done();
            });
        })

        it('returns all teams I am org admin of', function (done) {
            const userid = Random.id()
            sandbox.stub(Meteor, 'userId').returns(userid)

            const adminids = []
            adminids.push(userid)

            // create an org
            const org = TestData.fakeOrganization({ admins: adminids })
            const orgid = Organizations.insert(org)

            const orgMember = TestData.fakeOrganizationMember({ organizationId: orgid, userId: userid, isAdmin: true })
            const memberId = OrganizationMembers.insert(orgMember)

            for (let i = 0; i < 5; i += 1) {
                const teamid = Teams.insert(TestData.fakeTeam({ organizationId: orgid, name: `test team ${i}` }))
                if (i < 2) {
                    TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: userid }))
                } else {
                    TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: Random.id() }))
                }
            }

            const fakeids = []
            fakeids.push(Random.id())

            const org2 = TestData.fakeOrganization({ admins: fakeids })
            const orgid2 = Organizations.insert(org2)

            for (let i = 0; i < 2; i += 1) {
                const teamid = Teams.insert(TestData.fakeTeam({ organizationId: orgid2, name: `another test team ${i}` }))
                TeamMembers.insert(TestData.fakeTeamMember({ teamId: teamid, userId: Random.id() }))
            }

            const collector = new PublicationCollector()

            collector.collect('allTeams', {}, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { teams } = collections
                try {
                    expect(teams).to.have.length(5)
                } catch (err) {
                    done(err)
                }
                done();
            });
        })
    })
}
