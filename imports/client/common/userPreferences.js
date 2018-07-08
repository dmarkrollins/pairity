import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery'
import { Toast } from './toast'
import { Pairity, UserPreferences } from '../../lib/pairity'

Template.userPreferences.onCreated(function () {
    const self = this
    self.primaryRole = ''
    self.errorMessage = new ReactiveVar('')
    self.passwordResetErrorMessage = new ReactiveVar('')
    self.passwordInvalidFormatErrorMessage = new ReactiveVar('')
    self.isValidPassword = new ReactiveVar(false)
})

Template.userPreferences.helpers({
    errorMessage() {
        return Template.instance().errorMessage.get()
    },
    passwordResetErrorMessage() {
        return Template.instance().passwordResetErrorMessage.get()
    },
    passwordInvalidFormatErrorMessage() {
        return Template.instance().passwordInvalidFormatErrorMessage.get()
    },
    isValidPassword() {
        return Template.instance().isValidPassword.get()
    },
    engineerChecked() {
        const p = UserPreferences.findOne()
        if (p.userPreferences) {
            if (p.userPreferences.primaryRole === Pairity.MemberRoles.ENGINEER) {
                return 'checked'
            }
        } else {
            return true // default everyone to an engineer until they say otherwise (to support pair assign ui)
        }
    },
    designChecked() {
        const p = UserPreferences.findOne()
        if (p.userPreferences) {
            if (p.userPreferences.primaryRole === Pairity.MemberRoles.DESIGN) {
                return 'checked'
            }
        }
    },
    productChecked() {
        const p = UserPreferences.findOne()
        if (p.userPreferences) {
            if (p.userPreferences.primaryRole === Pairity.MemberRoles.PRODUCT) {
                return 'checked'
            }
        }
    },
    isReady() {
        return FlowRouter.subsReady()
    }
})

Template.userPreferences.events({
    'change input:radio[name="role"]': function (event, instance) {
        instance.primaryRole = event.target.value
    },
    'submit #preferencesForm': function (event, instance) {
        event.preventDefault()

        instance.errorMessage.set('')

        const role = event.target.role.value

        if (!role) {
            instance.errorMessage.set('You must choose a role!')
            return
        }

        Meteor.call('setUserPreferences', role, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showSuccess('Preferences Saved!')
            }
        })
    },
    'submit #resetPasswordForm': function (event, instance) {
        event.preventDefault()

        if (!instance.isValidPassword.get()) {
            instance.passwordResetErrorMessage.set('Please enter a valid password')
            return
        }
        const resetPasswordForm = $('#resetPasswordForm')
        const passwordField = resetPasswordForm.find('#newPassword')
        const password = passwordField.val()
        const confirmPasswordField = resetPasswordForm.find('#confirmPassword')
        const confirmPassword = confirmPasswordField.val()

        Meteor.call('resetUserPassword', password, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showSuccess('Password Reset!')
            }
        })
        instance.isValidPassword.set(false)
        passwordField.val('')
        confirmPasswordField.val('')
    },
    'change input:password': function (event, instance) {
        instance.passwordResetErrorMessage.set('')
        instance.passwordInvalidFormatErrorMessage.set('')

        const resetPasswordForm = $('#resetPasswordForm')
        const password = resetPasswordForm.find('#newPassword').val()
        const confirmPassword = resetPasswordForm.find('#confirmPassword').val()

        function isNotEmpty(str) {
            return str !== null && str !== undefined && str !== ''
        }

        if (isNotEmpty(password)) {
            if (!Pairity.PasswordRegex.test(password)) {
                instance.passwordInvalidFormatErrorMessage.set('Invalid password - must be >= 8 chars and contain a mix up upper and lower case letters plus at least 1 number :)')
                return
            }
        }

        if (isNotEmpty(password) && isNotEmpty(confirmPassword)) {
            if (password !== confirmPassword) {
                instance.passwordResetErrorMessage.set('Passwords do not match!')
                return
            }
            instance.isValidPassword.set(true)
        }
    }
})
