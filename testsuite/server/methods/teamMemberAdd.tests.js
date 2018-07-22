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
import { Pairity, Organizations, OrganizationMembers, Teams, TeamMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'

import { TestData } from '../../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Method - Team Member Add', function () {
        let userId
        let sandbox
        let subject
        let fakeTeamId
        let fakeOrgMemberId
        let fakeOrgId

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            subject = Meteor.server.method_handlers.teamMemberAdd;
            userId = Random.id()
            fakeTeamId = Random.id()
            fakeOrgMemberId = Random.id()
            fakeOrgId = Random.id()
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged in to perform this action! [not-logged-in]');
        })

        it('team must exist', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw team not found').to.be.equal('Team not found! [not-found]');
        })

        it('user calling method must be an org member', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ _id: fakeTeamId }))
            sandbox.stub(OrganizationMembers, 'findOne').onCall(0).returns(null)

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw org member not found').to.be.equal('You must be a member of the organization you are attempting to alter. [error]');
        })

        it('user being acted upon must be part of org', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ _id: fakeTeamId }))
            const orgMemberStub = sandbox.stub(OrganizationMembers, 'findOne')
            orgMemberStub.onCall(0).returns({ organizationId: fakeOrgId })
            orgMemberStub.onCall(1).returns()

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw user org member not found').to.be.equal('Organization Member not found! [not-found]');
        })

        it('team must be part of the org being acted upon', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ _id: fakeTeamId, organizationId: Random.id() }))
            const orgMemberStub = sandbox.stub(OrganizationMembers, 'findOne')
            orgMemberStub.onCall(0).returns({ organizationId: fakeOrgId })
            orgMemberStub.onCall(1).returns({ organizationId: fakeOrgId, teamId: fakeTeamId })

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw user org member not found').to.be.equal('User must be a member of the organization that this team belongs to. [error]');
        })

        it('if not super admin or org admin must be team admin - member not found', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ _id: fakeTeamId, organizationId: fakeOrgId }))
            const orgMemberStub = sandbox.stub(OrganizationMembers, 'findOne')
            orgMemberStub.onCall(0).returns({ organizationId: fakeOrgId, isAdmin: false })
            orgMemberStub.onCall(1).returns({ organizationId: fakeOrgId, teamId: fakeTeamId })
            sandbox.stub(Pairity, 'isSuperAdmin').returns(false)

            const teamMemberStub = sandbox.stub(TeamMembers, 'findOne')
            teamMemberStub.onCall(0).returns(null)

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should be team admin').to.be.equal('You must be an admin team member to perform this action. [error]');
        })

        it('if not super admin or org admin must be team admin - member found', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ _id: fakeTeamId, organizationId: fakeOrgId }))
            const orgMemberStub = sandbox.stub(OrganizationMembers, 'findOne')
            orgMemberStub.onCall(0).returns({ organizationId: fakeOrgId, isAdmin: false })
            orgMemberStub.onCall(1).returns({ organizationId: fakeOrgId, teamId: fakeTeamId })
            sandbox.stub(Pairity, 'isSuperAdmin').returns(false)
            const teamMemberStub = sandbox.stub(TeamMembers, 'findOne')
            teamMemberStub.onCall(0).returns({ isAdmin: false })

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should be team admin').to.be.equal('You must be an admin team member to perform this action. [error]');
        })

        it('user must not already be a member of the target team', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ _id: fakeTeamId, organizationId: fakeOrgId }))
            const orgMemberStub = sandbox.stub(OrganizationMembers, 'findOne')
            orgMemberStub.onCall(0).returns({ organizationId: fakeOrgId, isAdmin: false })
            orgMemberStub.onCall(1).returns({ organizationId: fakeOrgId, teamId: fakeTeamId })
            sandbox.stub(Pairity, 'isSuperAdmin').returns(false)
            const teamMemberStub = sandbox.stub(TeamMembers, 'findOne')
            teamMemberStub.onCall(0).returns({ isAdmin: true })
            teamMemberStub.onCall(1).returns({ _id: 'fake-id' }) // found

            try {
                const resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'user should not be a member').to.be.equal('User is already a member of the team! [error]');
        })

        it('works correctly stubbed', function () {
            const context = { userId };
            let msg = '';

            sandbox.stub(Teams, 'findOne').returns(TestData.fakeTeam({ _id: fakeTeamId, organizationId: fakeOrgId }))
            const orgMemberStub = sandbox.stub(OrganizationMembers, 'findOne')
            orgMemberStub.onCall(0).returns({ organizationId: fakeOrgId, isAdmin: false })
            orgMemberStub.onCall(1).returns({
                organizationId: fakeOrgId,
                teamId: fakeTeamId,
                username: 'fake-name',
                userId: 'fake-id'
            })
            sandbox.stub(Pairity, 'isSuperAdmin').returns(false)
            const teamMemberStub = sandbox.stub(TeamMembers, 'findOne')
            teamMemberStub.onCall(0).returns({ isAdmin: true })
            teamMemberStub.onCall(1).returns(null) // not found

            sandbox.stub(TeamMembers, 'insert').returns('fake-id')

            let resultId

            try {
                resultId = subject.apply(context, [fakeTeamId, fakeOrgMemberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should be blank').to.be.equal('')
            expect(resultId, 'returns id').to.be.equal('fake-name')

            const args = TeamMembers.insert.args[0][0]
            expect(args.organizationId).to.equal(fakeOrgId)
            expect(args.userId).to.equal('fake-id')
            expect(args.teamId).to.equal(fakeTeamId)
            expect(args.isAdmin).to.be.false
            expect(args.isPresent).to.be.true
        })
    })
}
