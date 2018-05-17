/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../../clientTestHelpers';

import TestData from '../../testData.js'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/common/signIn.html'
    import '../../../imports/client/common/signIn.js'

    describe('Sign In Dialog', function () {
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
            withRenderedTemplate('signIn', null, (el) => {
                expect($(el).find('#userName'), 'username').to.have.length(1)
                expect($(el).find('#password'), 'password').to.have.length(1)
                expect($(el).find('#btnSignIn'), 'signin btn').to.have.length(1)
                expect($(el).find('#btnSignUp'), 'signup btn').to.have.length(0)
                expect($(el).find('span#errorMessage'), 'err message span').to.have.length(1)
                expect($(el).find('span.errorMessage'), 'err message class').to.have.length(1)
                expect($(el).find('img#logoImage'), 'logo').to.have.length(1)
            });
        })

        it('validates input', function () {
            sandbox.stub(Meteor, 'loginWithPassword')

            withRenderedTemplate('signIn', null, (el) => {
                expect($(el).find('#btnSignIn'), 'should have next button').to.have.length(1)

                $(el).find('#btnSignIn')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('User name and password required!')
                expect(Meteor.loginWithPassword).to.not.have.been.called
            });
        })

        it('with valid input calls login correctly', function () {
            sandbox.stub(Meteor, 'loginWithPassword')

            withRenderedTemplate('signIn', null, (el) => {
                expect($(el).find('#btnSignIn'), 'should have next button').to.have.length(1)

                $(el).find('#userName').val('testuser')
                $(el).find('#password').val('testpw')
                Tracker.flush()

                $(el).find('#btnSignIn')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('')
                expect(Meteor.loginWithPassword).to.have.been.called

                const parms = Meteor.loginWithPassword.args[0]
                expect(parms[0]).to.equal('testuser')
                expect(parms[1]).to.equal('testpw')
            });
        })
    })
}
