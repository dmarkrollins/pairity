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
import { Organizations, OrganizationMembers } from '../../../imports/lib/pairity'

const should = chai.should();

if (Meteor.isServer) {
    import '../../../imports/server/publications/publication-organizationMembers'

    describe('Publication - OrganizationMembers', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            OrganizationMembers.remove({})
            Meteor.users.remove({})
        });

        it('OrganizationMembers published', function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            const orgId = Organizations.insert(TestData.fakeOrganization())

            const orgUsers = []

            for (let i = 0; i < 5; i += 1) {
                const id = Meteor.users.insert({
                    createdAt: new Date(),
                    username: `user${i}`,
                    emails: [
                        {
                            address: `user${i}@fake.com`,
                            verified: false
                        }
                    ],
                    userPreferences: {
                        primaryRole: 'product'
                    }
                })
                orgUsers.push(id)
            }

            orgUsers.forEach((id) => {
                const member = TestData.fakeOrganizationMember({ organizationId: orgId, userId: id, status: 'Pending' })
                OrganizationMembers.insert(member)
            })

            const collector = new PublicationCollector()

            collector.collect('organizationMembers', orgId, (collections) => {
                console.log('The collections', JSON.stringify(collections, null, 4));
                const { organizationMembers, users } = collections
                try {
                    expect(organizationMembers).to.have.length(5)
                    expect(organizationMembers[0].userId).to.equal(orgUsers[0])
                    expect(users[0]._id).to.be.equal(orgUsers[0])
                    expect(users[0].username).to.be.equal('user0')
                    expect(users[0].emails[0].address).to.be.equal('user0@fake.com')
                    done();
                } catch (err) {
                    done(err)
                }
            });
        })
    })
}
