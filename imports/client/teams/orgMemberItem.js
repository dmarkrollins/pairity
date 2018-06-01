import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'


Template.orgMemberItem.helpers({
    isTeamMember() {
        return this.isTeamMember(this.userId)
    },
    isSelf() {
        return Meteor.userId() === this.userId
    },
    invitee() {
        return this.data
    }
})

Template.orgMemberItem.events({
    'click #btnAdd': function (event, instance) {
        this.addTeamMember(this.data._id)
    },
    'click #btnRemove': function (event, instance) {
        this.removeTeamMember(this.data._id)
    }
})
