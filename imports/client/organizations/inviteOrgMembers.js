import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { Toast } from '../common/toast'
import { OrganizationMembers } from '../../lib/pairity'

Template.inviteOrgMembers.helpers({
    invitees() {
        return Meteor.users.find()
    },
    noPendingMembers() {
        return true
    }
})

Template.inviteOrgMembers.events({
    'keypress #textInvite': function (event, instance) {
        if (event.which === 13) {
            event.stopPropagation()
            Meteor.call('inviteOrgMember', event.target.value, function (err, response) {
                if (err) {
                    Toast.showError(err.reason)
                }
            })
        }
    }
})
