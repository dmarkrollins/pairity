/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { Accounts } from 'meteor/accounts-base'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import moment from 'moment'
import { Pairity, Organizations, OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'

import { TestData } from '../../testData'
import { SIGTSTP } from 'constants';

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Method - UnInvite Org Member', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.unInviteOrganizationMember;
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, []);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged in to perform this action! [not-logged-in]');
        })

        it('must be a member of an org', function () {
            const context = { userId: userId };
            let msg = '';
            const memberId = Random.id()

            sandbox.stub(OrganizationMembers, 'findOne')

            try {
                const resultId = subject.apply(context, [memberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(OrganizationMembers.findOne).to.have.been.called
            expect(OrganizationMembers.findOne).to.have.been.calledWith(memberId)

            expect(msg, 'must be an org member').to.be.equal('Organization Member not found! [not-found]');
        })

        it('member status must be pending', function () {
            const context = { userId: userId };
            let msg = '';
            const memberId = Random.id()

            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMember({ status: Pairity.MemberStatuses.MEMBER_ACTIVE }))

            try {
                const resultId = subject.apply(context, [memberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(OrganizationMembers.findOne).to.have.been.called
            expect(OrganizationMembers.findOne).to.have.been.calledWith(memberId)

            expect(msg, 'must be a pending member').to.be.equal('User has already accepted invite! [error]');
        })

        it('works correctly stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const memberId = Random.id()

            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMember())
            sandbox.stub(OrganizationMembers, 'remove')

            try {
                const resultId = subject.apply(context, [memberId]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'no error').to.equal('')
            expect(OrganizationMembers.findOne).to.have.been.called
            expect(OrganizationMembers.findOne).to.have.been.calledWith(memberId)
            expect(OrganizationMembers.remove.args[0][0]._id).to.equal(memberId)
        })
    })
}
