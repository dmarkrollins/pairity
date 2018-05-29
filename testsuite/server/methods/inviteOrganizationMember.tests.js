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

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Method - Invite Org Member', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.inviteOrganizationMember;
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

        it('org must exist', function () {
            const context = { userId: userId };
            let msg = '';

            try {
                const resultId = subject.apply(context, []);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw org not found').to.be.equal('Organization not found! [not-found]');
        })

        it('user must not already be an org member', function () {
            const context = { userId: userId };
            let msg = '';

            sandbox.stub(Organizations, 'findOne').returns(TestData.fakeOrganization())
            sandbox.stub(Accounts, 'findUserByEmail').returns({ _id: Random.id() })
            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMember())

            try {
                const resultId = subject.apply(context, []);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw already in org').to.be.equal('User is already a member of an organization! [error]');
        })

        it('should do invite correctly stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const orgId = Random.id()

            sandbox.stub(Organizations, 'findOne').returns(TestData.fakeOrganization({ _id: orgId }))
            sandbox.stub(Accounts, 'findUserByEmail').returns(null)
            sandbox.stub(Accounts, 'createUser').returns('fakeid')
            sandbox.stub(OrganizationMembers, 'insert').returns(Random.id())
            sandbox.stub(Accounts, 'sendEnrollmentEmail')
            sandbox.stub(OrganizationMembers, 'findOne')

            try {
                const resultId = subject.apply(context, [orgId, 'fake@fake.com', false]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should not throw error').to.be.equal('');
            expect(Accounts.createUser).to.have.been.called
            expect(Accounts.createUser).to.have.been.calledWith({ email: 'fake@fake.com' })

            expect(OrganizationMembers.insert).to.have.been.called
            const args = OrganizationMembers.insert.args[0]

            expect(args[0].organizationId).to.equal(orgId)
            expect(args[0].userId).to.equal('fakeid')
            expect(args[0].status).to.equal(Pairity.MemberStatuses.MEMBER_PENDING)
            expect(args[0].isAdmin).to.equal(false)

            expect(Accounts.sendEnrollmentEmail).to.have.been.called
            expect(Accounts.sendEnrollmentEmail, 'send enrollment email called correctly').to.have.been.calledWith('fakeid')
        })

        it('does not create user if they already exist', function () {
            const context = { userId: userId };
            let msg = '';
            const orgId = Random.id()
            const memberId = Random.id()
            let resultId

            sandbox.stub(Organizations, 'findOne').returns(TestData.fakeOrganization({ _id: orgId }))
            sandbox.stub(Accounts, 'findUserByEmail').returns({ _id: userId }) // found
            sandbox.stub(Accounts, 'createUser')
            sandbox.stub(OrganizationMembers, 'insert').returns(memberId)
            sandbox.stub(Accounts, 'sendEnrollmentEmail')
            sandbox.stub(OrganizationMembers, 'findOne')

            try {
                resultId = subject.apply(context, [orgId, 'fake@fake.com', false]);
            } catch (error) {
                msg = error.message;
            }

            expect(Accounts.createUser).to.not.have.been.called
            expect(resultId, 'org member id returned').to.equal(memberId)
        })

        it('handles not being able to send enrollment email', function () {
            const context = { userId: userId };
            let msg = '';
            const orgId = Random.id()

            sandbox.stub(Organizations, 'findOne').returns(TestData.fakeOrganization({ _id: orgId }))
            sandbox.stub(Accounts, 'findUserByEmail').returns(null)
            sandbox.stub(Accounts, 'createUser').returns('fakeid')
            sandbox.stub(OrganizationMembers, 'insert').returns(Random.id())
            sandbox.stub(Accounts, 'sendEnrollmentEmail').throws('fake-error')
            sandbox.stub(Logger, 'log')
            sandbox.stub(OrganizationMembers, 'findOne')

            try {
                const resultId = subject.apply(context, [orgId, 'fake@fake.com', false]);
            } catch (error) {
                msg = error.message;
            }

            expect(Accounts.sendEnrollmentEmail).to.have.been.called
            expect(Logger.log).to.have.been.calledTwice
            const args = Logger.log.args[0]
            expect(args[0]).to.equal('Send enrollment email error')
            expect(args[1]).to.not.be.null
            expect(msg, 'lets user know email did not go').to.equal('Enrollment email could not be sent. Please try again later. [error]')
        })
    })
}
