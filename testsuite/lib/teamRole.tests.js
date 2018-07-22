/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { IsTeamAdmin, TeamMembers } from '../../imports/lib/pairity'
import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isServer) {
    describe('Team Roles', function () {
        let sandbox
        let userId
        let subject
        let result
        let msg

        beforeEach(() => {
            sandbox = sinon.createSandbox()
            subject = Meteor.server.method_handlers.isTeamAdmin;
            userId = Random.id()
            msg = ''
        })

        afterEach(() => {
            sandbox.restore()
            TeamMembers.remove({})
            Meteor.users.remove({})
        })

        it('checks team members', () => {
            const tid = Random.id()
            const team = TestData.fakeTeam({ _id: tid })
            TeamMembers.insert(TestData.fakeTeamMember({ teamId: tid, userId, isAdmin: true }))
            const context = { userId }

            try {
                result = subject.apply(context, [team]);
            } catch (error) {
                msg = error.message;
            }
            expect(msg).to.equal('')
            expect(result).to.be.true
        })

        it('checks super admin when not team admin', () => {
            const tid = Random.id()
            const team = TestData.fakeTeam({ _id: tid })
            const uid = Meteor.users.insert(TestData.fakeUser({ username: 'admin' }))
            const context = { userId: uid }

            try {
                result = subject.apply(context, [team]);
            } catch (error) {
                msg = error.message;
            }
            expect(msg).to.equal('')
            expect(result).to.be.true
        })
    })
}
