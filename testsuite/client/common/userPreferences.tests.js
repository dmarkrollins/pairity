/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../../clientTestHelpers';
import { UserPreferences, Pairity } from '../../../imports/lib/pairity'

import { TestData } from '../../testData.js'

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
            sandbox.stub(FlowRouter, 'subsReady').returns(true)
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
                    expect(parms[1]).to.equal(Pairity.MemberRoles.ENGINEER)
                });
            })

            it('displays saved role correctly - engineer', function () {
                sandbox.stub(UserPreferences, 'findOne').returns(TestData.fakeUser({ primaryRole: Pairity.MemberRoles.ENGINEER }))
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('input#engineer:checked'), 'engineering should be checked').to.have.length(1)
                })
            })

            it('displays saved role correctly - designer', function () {
                sandbox.stub(UserPreferences, 'findOne').returns(TestData.fakeUser({ primaryRole: Pairity.MemberRoles.DESIGN }))
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('input#design:checked'), 'design should be checked').to.have.length(1)
                })
            })

            it('displays saved role correctly - product', function () {
                sandbox.stub(UserPreferences, 'findOne').returns(TestData.fakeUser({ primaryRole: Pairity.MemberRoles.PRODUCT }))
                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('input#product:checked'), 'product should be checked').to.have.length(1)
                })
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

            it('displays error when no passwords entered and change button clicked', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    $(el).find('#btnChangePassword').click()

                    Tracker.flush()

                    expect($(el).find('span#passwordInvalidFormatErrorMessage')[0].innerText, 'reset password format err message span').to.equal('')
                    expect($(el).find('span#passwordResetErrorMessage')[0].innerText, 'reset password err message span').to.equal('Please enter a valid password')
                });
            })

            it('displays error with invalid password format', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    $(el).find('#newPassword').val('123').trigger('change')
                    Tracker.flush()
                    expect($(el).find('span#passwordInvalidFormatErrorMessage')[0].innerText, 'reset password format err message span').to.equal('Invalid password - must be >= 8 chars and contain a mix up upper and lower case letters plus at least 1 number :)')
                });
            })

            it('does not display error when password is formatted properly', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    $(el).find('#newPassword').val('Abcdefg123').trigger('change')
                    Tracker.flush()
                    expect($(el).find('span#passwordInvalidFormatErrorMessage')[0].innerText, 'reset password format err message span').to.equal('')
                });
            })

            it('displays error when new and confirm passwords do not match', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    $(el).find('#newPassword').val('Abcdefg123').trigger('change')
                    $(el).find('#confirmPassword').val('Abcdefg12').trigger('change')

                    Tracker.flush()

                    expect($(el).find('span#passwordInvalidFormatErrorMessage')[0].innerText, 'reset password format err message span').to.equal('')
                    expect($(el).find('span#passwordResetErrorMessage')[0].innerText, 'reset password err message span').to.equal('Passwords do not match!')
                });
            })

            it('does not display error when new and confirm passwords match', () => {
                withRenderedTemplate('userPreferences', null, (el) => {
                    $(el).find('#newPassword').val('Abcdefg123').trigger('change')
                    $(el).find('#confirmPassword').val('Abcdefg123').trigger('change')

                    Tracker.flush()

                    expect($(el).find('span#passwordInvalidFormatErrorMessage')[0].innerText, 'reset password format err message span').to.equal('')
                    expect($(el).find('span#passwordResetErrorMessage')[0].innerText, 'reset password err message span').to.equal('')
                });
            })

            it('with valid password inputs calls reset password correctly', function () {
                sandbox.stub(Meteor, 'call')

                withRenderedTemplate('userPreferences', null, (el) => {
                    expect($(el).find('#btnChangePassword'), 'should have change button').to.have.length(1)

                    $(el).find('#newPassword').val('Abcdefg123').trigger('change')
                    $(el).find('#confirmPassword').val('Abcdefg123').trigger('change')

                    Tracker.flush()

                    $(el).find('#btnChangePassword')[0].click()
                    Tracker.flush()

                    expect(Meteor.call).to.have.been.called

                    const parms = Meteor.call.args[0]
                    expect(parms[1]).to.equal('Abcdefg123')

                    expect($(el).find('#newPassword').val()).to.equal('')
                    expect($(el).find('#confirmPassword').val()).to.equal('')
                });
            })
        })
    })
}
