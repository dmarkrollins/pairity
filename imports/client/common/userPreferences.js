import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Toast } from '../../client/common/toast'
import { UserPreferences } from '../../../imports/lib/pairity'

Template.userPreferences.onCreated(function () {
    const self = this
    self.primaryRole = ''
    self.errorMessage = new ReactiveVar('')
})

Template.userPreferences.helpers({
    errorMessage() {
        return Template.instance().errorMessage.get()
    },
    engineerChecked() {
        const p = UserPreferences.findOne()
        if (p.userPreferences) {
            if (p.userPreferences.primaryRole === 'engineer') {
                return 'checked'
            }
        }
    },
    designChecked() {
        const p = UserPreferences.findOne()
        if (p.userPreferences) {
            if (p.userPreferences.primaryRole === 'design') {
                return 'checked'
            }
        }
    },
    productChecked() {
        const p = UserPreferences.findOne()
        if (p.userPreferences) {
            if (p.userPreferences.primaryRole === 'product') {
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
    }
})
