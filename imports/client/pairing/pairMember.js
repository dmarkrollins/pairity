import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore'
import { Pairity } from '../../lib/pairity'

Template.pairMember.helpers({
    isPresent() {
        return this.data.isPresent
    },
    userInfo() {
        const user = Meteor.users.findOne(this.data.userId)
        if (user) {
            return `${user.username} - ${user.emails[0].address}`
        }
    },
    isSelected() {
        const roles = Session.get(Pairity.AmplifiedKeys.ROLE_FILTER)
        const user = Meteor.users.findOne(this.data.userId)
        if (user) {
            let myRole
            if (user.userPreferences) {
                myRole = user.userPreferences.primaryRole || Pairity.MemberRoles.ENGINEER
            } else {
                myRole = Pairity.MemberRoles.ENGINEER
            }
            return _.contains(roles, myRole) ? '' : 'grayed-out'
        }
        return false
    },
    isDisabled() {
        const roles = Session.get(Pairity.AmplifiedKeys.ROLE_FILTER)
        const user = Meteor.users.findOne(this.data.userId)
        if (user) {
            let myRole
            if (user.userPreferences) {
                myRole = user.userPreferences.primaryRole || Pairity.MemberRoles.ENGINEER
            } else {
                myRole = Pairity.MemberRoles.ENGINEER
            }
            return _.contains(roles, myRole) ? '' : 'disabled'
        }
        return ''
    }
})

Template.pairMember.events({
    'click #cbPresent': function (event, instance) {
        event.preventDefault()
        if (event.target.checked) {
            instance.data.togglePresenceOn(this.data._id)
        } else {
            instance.data.togglePresenceOff(this.data._id)
        }
    }
})
