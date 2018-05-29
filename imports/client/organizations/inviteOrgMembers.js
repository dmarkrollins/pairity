import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery'

import { Toast } from '../common/toast'
import { Pairity, Organizations, OrganizationMembers } from '../../lib/pairity'

Template.inviteOrgMembers.onCreated(function () {
    const self = this

    self.errorMessage = new ReactiveVar('')

    self.removeMember = (id) => {
        Meteor.call('unInviteOrganizationMember', id, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showSuccess('Invite removed successfully!')
            }
        })
    }
})

Template.inviteOrgMembers.helpers({
    invitees() {
        return OrganizationMembers.find({ status: Pairity.MemberStatuses.MEMBER_PENDING })
    },
    noPendingMembers() {
        return OrganizationMembers.find({ status: Pairity.MemberStatuses.MEMBER_PENDING }).count() === 0
    },
    errMessage() {
        return Template.instance().errorMessage.get()
    },
    currentItem() {
        const instance = Template.instance()
        return {
            data: this,
            unInvite: function (id) {
                instance.removeMember(id)
            }
        }
    },
    isReady() {
        return FlowRouter.subsReady()
    }
})

Template.inviteOrgMembers.events({
    'submit #inviteForm': function (event, instance) {
        event.preventDefault()

        instance.errorMessage.set('')
        const isAdmin = event.target.orgAdmin.checked || false;
        const email = event.target.textInvite.value || '';

        if (email === '') {
            instance.errorMessage.set('Email address required!')
            return
        }

        const org = Organizations.findOne()

        $('#btnSubmit').addClass('pure-button-disabled');
        instance.errorMessage.set('Please wait while invitation is being sent....')

        Meteor.call('inviteOrganizationMember', org._id, email, isAdmin, function (err, response) {
            $('#btnSubmit').removeClass('pure-button-disabled');
            if (err) {
                instance.errorMessage.set(err.reason)
            } else {
                $('#orgAdmin').prop('checked', false)
                $('#textInvite').val('')
                instance.errorMessage.set('Invitation sent!')
            }
        })
    }
})
