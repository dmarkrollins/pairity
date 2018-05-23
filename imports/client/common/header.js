import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { _ } from 'meteor/underscore'
import { ReactiveVar } from 'meteor/reactive-var'

import { Pairity, Membership } from '../../lib/pairity'

Template.header.onCreated(function () {
    const self = this

    self.isReady = new ReactiveVar(false)

    self.autorun(() => {
        const subscription = self.subscribe('myMembership')
        if (subscription.ready()) {
            self.isReady.set(true)
        }
    })
})

Template.header.helpers({
    search() {
        return _.isUndefined(this.showSearch) ? false : this.showSearch
    },
    orgManager() {
        if (Template.instance().isReady.get()) {
            const info = Membership.findOne()
            if (info) {
                return info.isOrgAdmin
            }
        }
        return false
    },
    isAdmin() {
        return !Meteor.user() ? false : Meteor.user().username === 'admin'
    }
})

Template.header.events({
    'click #btnLogout': function (event, instance) {
        Meteor.logout((err) => {
            if (!err) {
                FlowRouter.go('/')
            }
        })
    }
})
