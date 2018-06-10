/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { Pairity, IsTeamAdmin, TeamMembers } from '../../imports/lib/pairity'
import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isServer) {
    describe('Team Roles', function () {
        let sandbox

        beforeEach(() => {
            sandbox = sinon.createSandbox()
        })

        afterEach(() => {
            sandbox.restore()
        })

        it('checks team members', () => {
            const id = Random.id()
            const fakeTeam = TestData.fakeTeam()
            sandbox.stub(TeamMembers, 'findOne').returns(TestData.fakeTeamMember({ isAdmin: true }))

            expect(IsTeamAdmin(fakeTeam, id)).to.be.true
        })

        it('checks super admin', () => {
            const id = Random.id()
            const fakeTeam = TestData.fakeTeam()
            sandbox.stub(Meteor.users, 'findOne').returns(TestData.fakeUser({ username: 'admin' }))
            sandbox.stub(TeamMembers, 'findOne').returns(null)

            expect(IsTeamAdmin(fakeTeam, id)).to.be.true
        })
    })
}
