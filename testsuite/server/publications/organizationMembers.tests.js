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

        it('OrganizationMembers published - non admin', function (done) {
            const userStub = sandbox.stub(Meteor, 'users')
            userStub.find = sandbox.stub().returns({ username: 'not-admin' })

            sandbox.stub(Meteor, 'userId').returns(Random.id())

            const orgId = Organizations.insert(TestData.fakeOrganization())
            sandbox.stub(OrganizationMembers, 'findOne').returns({ organizationId: orgId })

            sandbox.stub(Organizations, 'find').returns([{ _id: orgId }])

            for (let i = 0; i < 5; i += 1) {
                const member = TestData.fakeOrganizationMember({
                    organizationId: orgId,
                    userId: Random.id(),
                    status: i === 3 ? 'Pending' : 'Active',
                    username: `user-name-${i}`
                })
                OrganizationMembers.insert(member)
            }

            const collector = new PublicationCollector()

            collector.collect('organizationMembers', { limit: 10, name: '' }, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { organizationMembers } = collections
                try {
                    expect(organizationMembers).to.have.length(4)
                    expect(organizationMembers[0].username).to.equal('user-name-0')
                    done();
                } catch (err) {
                    done(err)
                }
            });
        })

        it('OrganizationMembers published - admin', function (done) {
            const userStub = sandbox.stub(Meteor, 'users')
            userStub.find = sandbox.stub().returns({ username: 'admin' })

            sandbox.stub(Meteor, 'userId').returns(Random.id())

            const orgId = Organizations.insert(TestData.fakeOrganization())
            sandbox.stub(OrganizationMembers, 'findOne').returns({ organizationId: orgId })

            sandbox.stub(Organizations, 'find').returns([{ _id: orgId }])

            for (let i = 0; i < 5; i += 1) {
                const member = TestData.fakeOrganizationMember({
                    organizationId: orgId,
                    userId: Random.id(),
                    status: i === 3 ? 'Pending' : 'Active',
                    username: `user-name-${i}`
                })
                OrganizationMembers.insert(member)
            }

            const collector = new PublicationCollector()

            collector.collect('organizationMembers', { limit: 10, name: '' }, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { organizationMembers } = collections
                try {
                    expect(organizationMembers).to.have.length(4)
                    expect(organizationMembers[0].username).to.equal('user-name-0')
                    done();
                } catch (err) {
                    done(err)
                }
            });
        })
    })
}
