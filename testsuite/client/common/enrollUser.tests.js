/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Random } from 'meteor/random'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../../clientTestHelpers';

import TestData from '../../testData.js'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/common/enrollUser.html'
    import '../../../imports/client/common/enrollUser.js'

    describe('Enroll User Dialog', function () {
        let userId;
        let sandbox

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly', function () {
            withRenderedTemplate('enrollUser', null, (el) => {
                expect($(el).find('#userName'), 'username').to.have.length(1)
                expect($(el).find('#password'), 'password').to.have.length(1)
                expect($(el).find('#btnEnroll'), 'signin btn').to.have.length(1)
                expect($(el).find('span#errorMessage'), 'err message span').to.have.length(1)
                expect($(el).find('span.errorMessage'), 'err message class').to.have.length(1)
                expect($(el).find('img#logoImage'), 'logo').to.have.length(1)
            });
        })

        it('validates input', function () {
            sandbox.stub(Accounts, 'resetPassword')

            withRenderedTemplate('enrollUser', null, (el) => {
                expect($(el).find('#btnEnroll'), 'should have next button').to.have.length(1)

                $(el).find('#btnEnroll')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('User name and password required!')
                expect(Accounts.resetPassword).to.not.have.been.called
            });
        })

        it('the fake pw is not valid', function () {
            sandbox.stub(Accounts, 'resetPassword')

            withRenderedTemplate('enrollUser', null, (el) => {
                expect($(el).find('#btnEnroll'), 'should have next button').to.have.length(1)

                $(el).find('#userName').val('testuser')
                $(el).find('#password').val('FakePW99')
                Tracker.flush()

                $(el).find('#btnEnroll')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'fake password not valid').to.equal('Try a different password please!')
                expect(Accounts.resetPassword).to.not.have.been.called
            });
        })

        it('handles reset password failure correctly', function () {
            sandbox.stub(Meteor, 'userId').returns(null)
            sandbox.stub(Accounts, 'resetPassword').yields({ reason: 'fake-reset-error' })
            sandbox.stub(Meteor, 'call')
            sandbox.stub(FlowRouter, 'getParam').returns('fake-token')

            withRenderedTemplate('enrollUser', null, (el) => {
                expect($(el).find('#btnEnroll'), 'should have next button').to.have.length(1)

                $(el).find('#userName').val('testuser')
                $(el).find('#password').val('testpw123')
                Tracker.flush()

                $(el).find('#btnEnroll')[0].click()
                Tracker.flush()

                expect(Accounts.resetPassword).to.have.been.called
                expect(Accounts.resetPassword).to.have.been.calledWith('fake-token', 'testpw123')
                expect(Meteor.call).to.not.have.been.called
                expect($(el).find('#errorMessage')[0].innerText, 'on pw reset failure show error').to.equal('fake-reset-error')
            });
        })

        it('handles enroll error correctly', function () {
            sandbox.stub(Meteor, 'userId').returns(null)
            sandbox.stub(Accounts, 'resetPassword').yields(null)
            sandbox.stub(Meteor, 'call').yields({ reason: 'fake-enroll-error' })
            sandbox.stub(FlowRouter, 'go')

            withRenderedTemplate('enrollUser', null, (el) => {
                expect($(el).find('#btnEnroll'), 'should have next button').to.have.length(1)

                $(el).find('#userName').val('testuser')
                $(el).find('#password').val('testpw123')
                Tracker.flush()

                $(el).find('#btnEnroll')[0].click()
                Tracker.flush()

                expect(Accounts.resetPassword).to.have.been.called
                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('userEnrollment', 'testuser')
                expect($(el).find('#errorMessage')[0].innerText, 'show enroll error').to.equal('fake-enroll-error')
            });
        })

        it('not logged in handled correctly - stubbed', function () {
            sandbox.stub(Meteor, 'userId').returns(null)
            sandbox.stub(Accounts, 'resetPassword').yields(null)
            sandbox.stub(Meteor, 'call').yields(null, 'fake-route')
            sandbox.stub(FlowRouter, 'go')

            withRenderedTemplate('enrollUser', null, (el) => {
                expect($(el).find('#btnEnroll'), 'should have next button').to.have.length(1)

                $(el).find('#userName').val('testuser')
                $(el).find('#password').val('testpw123')
                Tracker.flush()

                $(el).find('#btnEnroll')[0].click()
                Tracker.flush()

                expect(Accounts.resetPassword).to.have.been.called
                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('userEnrollment', 'testuser')
                expect(FlowRouter.go).to.have.been.called
                expect(FlowRouter.go).to.have.been.calledWith('fake-route')
                expect($(el).find('#errorMessage')[0].innerText, 'no error').to.equal('')
            });
        })

        it('logged in handled correctly - stubbed', function () {
            sandbox.stub(Meteor, 'userId').returns(Random.id())
            sandbox.stub(Accounts, 'resetPassword')
            sandbox.stub(Meteor, 'call').yields(null, 'fake-route-2')
            sandbox.stub(FlowRouter, 'go')

            withRenderedTemplate('enrollUser', null, (el) => {
                expect($(el).find('#btnEnroll'), 'should have next button').to.have.length(1)

                $(el).find('#userName').val('testuser')
                $(el).find('#password').val('testpw123')
                Tracker.flush()

                $(el).find('#btnEnroll')[0].click()
                Tracker.flush()

                expect(Accounts.resetPassword).to.not.have.been.called
                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('userEnrollment', 'testuser')
                expect(FlowRouter.go).to.have.been.called
                expect(FlowRouter.go).to.have.been.calledWith('fake-route-2')
                expect($(el).find('#errorMessage')[0].innerText, 'no error').to.equal('')
            });
        })
    })
}
