/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import moment from 'moment'
import { Pairity, Teams, TeamMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'

import { TestData } from '../../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Method - Toggle Member Presence', function () {
        let userId
        let sandbox
        let subject
        let memberId

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            memberId = Random.id()
            subject = Meteor.server.method_handlers.toggleMemberPresence;
        });

        afterEach(function () {
            Teams.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, TestData.fakeTeam());
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged in to perform this action!');
        })

        it('must be a valid team member', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(TeamMembers, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [memberId, true]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'team member not found').to.be.equal('TeamMember not found!');
        })

        it('must be a valid team', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(TeamMembers, 'findOne').returns(TestData.fakeTeamMember())
            sandbox.stub(Teams, 'findOne').returns(null)


            try {
                const resultId = subject.apply(context, [memberId, true]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'team not found').to.be.equal('Team not found!');
        })

        it('must be team admin', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(TeamMembers, 'findOne').returns(TestData.fakeTeamMember({ isAdmin: false }))
            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam())


            try {
                const resultId = subject.apply(context, [memberId, true]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'team not found').to.be.equal('You must be the team administrator to perform this action!');
        })

        it('presence defaults to true', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(TeamMembers, 'findOne').returns(TestData.fakeTeamMember({ isAdmin: true }))
            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam())
            sandbox.stub(TeamMembers, 'update')

            try {
                const resultId = subject.apply(context, [memberId]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'no error').to.be.equal('');
            const args = TeamMembers.update.args[0]
            expect(args[1]).to.deep.equal({
                $set: {
                    isPresent: true
                }
            })
        })

        it('uses valid provided presence', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(TeamMembers, 'findOne').returns(TestData.fakeTeamMember({ isAdmin: true }))
            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam())
            sandbox.stub(TeamMembers, 'update')

            try {
                const resultId = subject.apply(context, [memberId, false]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'no error').to.be.equal('');
            const args = TeamMembers.update.args[0]
            expect(args[1]).to.deep.equal({
                $set: {
                    isPresent: false
                }
            })
        })
    })
}
