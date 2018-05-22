import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import { Toast } from '../../client/common/toast'
import { UserPreferences } from '../../../imports/lib/pairity'

Template.userPreferences.onCreated(function () {
    const self = this
    self.primaryRole = ''
    self.errorMessage = new ReactiveVar('')
    self.passwordResetErrorMessage = new ReactiveVar('')
})

Template.userPreferences.helpers({
    errorMessage() {
        return Template.instance().errorMessage.get()
    },
    passwordResetErrorMessage() {
        return Template.instance().passwordResetErrorMessage.get()
    },
    engineerChecked() {
        const p = UserPreferences.findOne()
        if (p) {
            if (p.userPreferences.primaryRole === 'engineer') {
                return 'checked'
            }
        }
    },
    designChecked() {
        const p = UserPreferences.findOne()
        if (p) {
            if (p.userPreferences.primaryRole === 'design') {
                return 'checked'
            }
        }
    },
    productChecked() {
        const p = UserPreferences.findOne()
        if (p) {
            if (p.userPreferences.primaryRole === 'product') {
                return 'checked'
            }
        }
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
    'submit #resetPasswordForm': function(event, instance){
        event.preventDefault()

        instance.passwordResetErrorMessage.set('')
    },
    'change input:password': function (event, instance) {
        event.preventDefault()

        instance.passwordResetErrorMessage.set('whats going on here?')

        var resetPasswordForm = $('#resetPasswordForm'),
            password = resetPasswordForm.find('#newPassword').val(),
            confirmPassword = resetPasswordForm.find('#confirmPassword').val()

            function isNotEmpty(str){
                return str !== null && str !== undefined && str !== ""
            }
        
            
        if (isNotEmpty(password) && isNotEmpty(confirmPassword)) {
            console.log(password + '=>' + confirmPassword)
            Meteor.call('resetUserPassword', password, function (err, response){
                if (err) {
                    Toast.showError(err.reason)
                } else {
                    Toast.showSuccess('Password Reset!')
                }
            })
        }
        return false
    }
})