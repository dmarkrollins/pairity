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

    describe('Method - User Enrollment', function () {
        let userId
        let sandbox
        let subject
        const token = 'fake-token'
        const userName = 'fake-name'
        const password = 'fake-password'

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.userEnrollment;
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = { };
            let msg = '';

            try {
                const resultId = subject.apply(context, []);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should be logged in').to.be.equal('You must be logged in to perform this action! [not-logged-in]');
        })

        it('set user name fails', function () {
            const context = { userId: userId };
            let msg = '';
            sandbox.stub(Accounts, 'setUsername').throws('fake-error')

            try {
                const resultId = subject.apply(context, [userName]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'user name must not exist').to.be.equal('User name already exists try something different. [error]');
        })

        it('not an org member', function () {
            const context = { userId: userId };
            let msg = '';
            sandbox.stub(Accounts, 'setUsername')
            sandbox.stub(OrganizationMembers, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [userName]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'must be a member').to.be.equal('Membership not found! [not-found]');
        })

        it('works correctly stubbed - admin', function () {
            const context = { userId: userId };
            let msg = '';
            let result;
            sandbox.stub(Accounts, 'setUsername')
            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMember({ isAdmin: true }))

            sandbox.stub(Meteor.users, 'findOne').returns({ email: [{ address: 'fake-address' }] })

            try {
                result = subject.apply(context, [userName]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'no error').to.be.equal('');
            expect(result, 'should return org link').to.equal('/organizations')
        })

        it('works correctly stubbed - non-admin', function () {
            const context = { userId: userId };
            let msg = '';
            let result;
            sandbox.stub(Accounts, 'setUsername')
            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMember({ isAdmin: false }))

            sandbox.stub(Meteor.users, 'findOne').returns({ email: [{ address: 'fake-address' }] })

            try {
                result = subject.apply(context, [userName]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'no error').to.be.equal('');
            expect(result, 'should return team link').to.equal('/teams')
        })
    })
}
