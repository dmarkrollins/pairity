/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { _ } from 'meteor/underscore'
import { Teams, PairHistory, TeamMembers, Organizations } from '../../../imports/lib/pairity'
import { TestData } from '../../testData'

const should = chai.should();

chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Method - Generate Pairs', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.generateTeamPairs;
        });

        afterEach(function () {
            PairHistory.remove({})
            Teams.remove({})
            Organizations.remove({})
            TeamMembers.remove({})
            Meteor.users.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                subject.apply(context, [Random.id()]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged in to perform this action! [not-logged-in]');
        })

        it('team should exist', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(null)

            try {
                subject.apply(context, [Random.id()]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw team not found').to.be.equal('Team not found! [not-found]');
        })

        it('team members should exist', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ userId }))

            try {
                subject.apply(context, [Random.id()]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw teammembers not found').to.be.equal('TeamMembers not found! [not-found]');
        })

        it('should be team admin', function () {
            const context = { userId };
            let msg = '';
            const teamId = Random.id()

            TeamMembers.insert(TestData.fakeTeamMember({ teamId }))

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ teamId, userId }))
            sandbox.stub(Meteor.users, 'findOne').returns(TestData.fakeUser())
            sandbox.stub(Organizations, 'findOne').returns(TestData.fakeOrganization({ userId }))


            try {
                subject.apply(context, [teamId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw no an admin').to.be.equal('You must be the team administrator to perform this action! [not-admin]');
        })

        it('generates pairs no history', function () {
            const context = { userId };
            let msg = '';
            let response

            Meteor.users.insert(TestData.fakeUser({ userId }))

            const organizationId = Organizations.insert(TestData.fakeOrganization())

            const teamId = Teams.insert(TestData.fakeTeam({ organizationId }))

            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({
                teamId,
                organizationId,
                userId,
                isAdmin: true
            }))

            try {
                response = subject.apply(context, [teamId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should not throw error').to.be.equal('');

            expect(response.pairs, 'should have two pairs').to.have.length(2)
        })

        it('generates pairs with history', function () {
            const context = { userId };
            let msg = '';
            let response1
            let response2

            Meteor.users.insert(TestData.fakeUser({ userId }))

            const organizationId = Organizations.insert(TestData.fakeOrganization())

            const teamId = Teams.insert(TestData.fakeTeam({ organizationId }))

            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({
                teamId,
                organizationId,
                userId,
                isAdmin: true
            }))

            try {
                response1 = subject.apply(context, [teamId]);
                response2 = subject.apply(context, [teamId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should not throw error').to.be.equal('');

            expect(response1.pairs, 'should have two pairs').to.have.length(2)
            expect(response2.pairs, 'should have two pairs').to.have.length(2)

            expect(response1.pairs[0]).to.not.equal(response2.pairs[0])
            expect(response1.pairs[1]).to.not.equal(response2.pairs[1])

            const ids = []

            ids.push(response2.pairs[0].memberOne)
            ids.push(response2.pairs[0].memberTwo)
            ids.push(response2.pairs[1].memberOne)
            ids.push(response2.pairs[1].memberTwo)

            const members = TeamMembers.find({ teamId }).fetch()

            const memberIds = _.pluck(members, '_id')

            const result = _.isEmpty(_.difference(ids, memberIds)) && _.isEmpty(_.difference(memberIds, ids))

            expect(result, 'all ids should be accounted for').to.be.true
        })

        it('generates pairs when people are missing - hedgehog (solo)', function () {
            const context = { userId };
            let msg = '';
            let response1

            Meteor.users.insert(TestData.fakeUser({ userId }))

            const organizationId = Organizations.insert(TestData.fakeOrganization())

            const teamId = Teams.insert(TestData.fakeTeam({ organizationId }))

            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId, isPresent: false }))
            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({ teamId, organizationId }))
            TeamMembers.insert(TestData.fakeTeamMember({
                teamId,
                organizationId,
                userId,
                isAdmin: true
            }))

            try {
                response1 = subject.apply(context, [teamId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should not throw error').to.be.equal('');

            expect(response1.pairs, 'should have two pairs').to.have.length(2)
            expect(response1.pairs[1].memberTwo).to.be.null
        })
    })
}
