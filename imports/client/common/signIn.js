import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery'

Template.signIn.onCreated(function () {
    const self = this

    self.errMessage = new ReactiveVar('')
})

Template.signIn.helpers({
    errMessage() {
        return Template.instance().errMessage.get()
    }
})

Template.signIn.events({
    'submit #signInForm': function (event, instance) {
        event.preventDefault()

        instance.errMessage.set('')
        const name = event.target.userName.value || '';
        const password = event.target.password.value || '';

        if (name === '' || password === '') {
            instance.errMessage.set('User name and password required!')
            return
        }

        $('#signInForm').prop('disabled', true);

        Meteor.loginWithPassword(name, password, function (err) {
            $('#signInForm').prop('disabled', false);
            if (err) {
                instance.errMessage.set(err.reason)
                return
            }
            FlowRouter.go('/teams')
        })
    }
})
