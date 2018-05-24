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
    import '../../../imports/client/common/userPreferences.html'
    import '../../../imports/client/common/userPreferences.js'

    describe('User Preferences', () => {
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

        describe('Roles', () => {
            it('displays roles correctly', function () {
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('#product'), 'product input').to.have.length(1)
                    expect($(el).find('#engineer'), 'engineer input').to.have.length(1)
                    expect($(el).find('#design'), 'design input').to.have.length(1)
                    expect($(el).find('#btnSave'), 'save btn').to.have.length(1)
                    expect($(el).find('span#errorMessage'), 'err message span').to.have.length(1)
                });
            })
    
            it('validates input', function () {
                sandbox.stub(Meteor, 'loginWithPassword')
    
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('#btnSave'), 'should have save button').to.have.length(1)
    
                    $(el).find('#btnSave')[0].click()
                    Tracker.flush()
    
                    expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('You must choose a role!')
                    expect(Meteor.loginWithPassword).to.not.have.been.called
                });
            })
    
            it('with valid input calls save user prefs correctly', function () {
                sandbox.stub(Meteor, 'call')
    
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('#btnSave'), 'should have save button').to.have.length(1)
    
                    $(el).find('#engineer').prop('checked', true);
    
                    Tracker.flush()
    
                    $(el).find('#btnSave')[0].click()
                    Tracker.flush()
    
                    expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('')
                    expect(Meteor.call).to.have.been.called
    
                    const parms = Meteor.call.args[0]
                    expect(parms[1]).to.equal('engineer')
                });
            })
        })

        describe('Password reset', () => {
            it('displays password reset fields correctly', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('#newPassword'), 'new password input').to.have.length(1)
                    expect($(el).find('#confirmPassword'), 'confirm password input').to.have.length(1)
                    expect($(el).find('#btnChangePassword'), 'password reset change btn').to.have.length(1)
                    expect($(el).find('span#passwordResetErrorMessage'), 'reset password err message span').to.have.length(1)
                });
            })

            it('displays input fields as type "password"', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('#newPassword')[0].type, 'new password input type').to.equal('password')
                    expect($(el).find('#confirmPassword')[0].type, 'confirm password input type').to.equal('password')
                });
            })

            it('displays error with invalid password format', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    $(el).find('#newPassword').val('123')
                    Template.userPreferences.fireEvent('change input:password')
                    Tracker.flush()
                    console.log(this)
                    expect($(el).find('span#passwordResetErrorMessage')[0].innerText, 'reset password err message span').to.equal('Invalid password - must be >= 8 chars and contain a mix up upper and lower case letters plus at least 1 number :)')
                });
            })
        })
    })
}
