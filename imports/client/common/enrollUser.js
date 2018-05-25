import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery'

import { Pairity } from '../../lib/pairity'

Template.enrolluser.onCreated(function () {
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

        instance.errMessage.set('')
        const name = event.target.userName.value || '';
        const password = event.target.password.value || '';

        if (name === '' || password === '') {
            instance.errMessage.set('User name and password required!')
            return
        }

        $('#enrollForm').prop('disabled', true);

        Meteor.call('userEnrollment', instance.token, name, password, function (err, response) {
            $('#enrollForm').prop('disabled', false);
            if (err) {
                Accounts.logout()
                instance.errMessage.set(err.reason)
                return
            }
            FlowRouter.go(response)
        })
    }

})
