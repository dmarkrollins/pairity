import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery'

import { Pairity } from '../../lib/pairity'

Template.enrollUser.onCreated(function () {
    const self = this

    self.token = FlowRouter.getParam('token')
    self.errorMessage = new ReactiveVar('')
})

Template.enrollUser.helpers({
    errMessage() {
        return Template.instance().errorMessage.get()
    }
})

Template.enrollUser.events({
    'submit #enrollForm': function (event, instance) {
        event.preventDefault()

        instance.errorMessage.set('')
        const name = event.target.userName.value || '';
        const password = event.target.password.value || '';

        if (name === '' || password === '') {
            instance.errorMessage.set('User name and password required!')
            return
        }

        if (password === 'FakePW99') {
            instance.errorMessage.set('Try a different password please!')
            return
        }

        $('#enrollForm').prop('disabled', true);

        if (!Meteor.userId()) {
            Accounts.resetPassword(instance.token, password, function (error) {
                if (error) {
                    $('#enrollForm').prop('disabled', false);
                    instance.errorMessage.set(error.reason)
                    return
                }

                // is now logged in

                Meteor.call('userEnrollment', name, function (err, response) {
                    $('#enrollForm').prop('disabled', false);
                    if (err) {
                        instance.errorMessage.set(err.reason)
                        return
                    }
                    FlowRouter.go(response)
                })
            })
        } else {
            // just set user to active
            Meteor.call('userEnrollment', name, function (err, response) {
                $('#enrollForm').prop('disabled', false);
                if (err) {
                    instance.errorMessage.set(err.reason)
                    return
                }
                FlowRouter.go(response)
            })
        }
    }

})
