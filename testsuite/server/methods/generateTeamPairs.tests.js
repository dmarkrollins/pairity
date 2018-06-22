/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Teams, PairHistory, TeamMembers, Organizations } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
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

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ userId }))

            // add org
            // add team (current user id is not an admin)
            // add users
            // add team members

            try {
                subject.apply(context, [Random.id()]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw no an admin').to.be.equal('Not adminç');
        })
    })
}
