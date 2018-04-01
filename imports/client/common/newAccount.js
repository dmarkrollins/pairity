import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { Accounts } from 'meteor/accounts-base'
import { $ } from 'meteor/jquery'

Template.newAccount.onCreated(function () {
    const self = this

    self.errMessage = new ReactiveVar('')

    self.setMessage = (message) => {
        self.errMessage.set(message)
    }
})

Template.newAccount.helpers({
    errMessage() {
        return Template.instance().errMessage.get()
    }
})

Template.newAccount.events({
    'click #btnCancel': function (event, instance) {
        FlowRouter.go('/')
    },
    'submit #signUpForm': function (event, instance) {
        event.preventDefault()

        instance.setMessage('')
        const doc = {}
        doc.userName = event.target.userName.value || ''
        doc.email = event.target.emailAddress.value || ''
        doc.password = event.target.password.value || ''
        // doc.agreeToTerms = event.target.agreeToTerms.checked
        doc.confirmPassword = event.target.confirmPassword.value || ''

        if (doc.userName === '') {
            instance.setMessage('A user name is required')
            return
        }

        if (doc.email === '') {
            instance.setMessage('An email address is required')
            return
        }

        if (doc.password === '') {
            instance.setMessage('Passwords required!')
            return
        }

        if (doc.password !== doc.confirmPassword) {
            instance.setMessage('Passwords do not match!')
            return
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(doc.password)) {
            instance.setMessage('Invalid password - must be >= 8 chars and contain a mix up upper and lower case letters plus at least 1 number :)')
            return
        }

        const options = {
            username: doc.userName,
            email: doc.email,
            password: doc.password
        }

        // preferences: { agreeToTerms: doc.agreeToTerms }

        $('#signUpForm').prop('disabled', true);

        Accounts.createUser(options, function (err) {
            $('#signUpForm').prop('disabled', false);
            if (err) {
                instance.setMessage(err.reason)
                return
            }
            FlowRouter.go('/teams')
        })
    }

})
