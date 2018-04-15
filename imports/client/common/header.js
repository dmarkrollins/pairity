import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { _ } from 'meteor/underscore'

import { Pairity } from '../../lib/pairity'

Template.header.helpers({
    search() {
        return _.isUndefined(this.showSearch) ? false : this.showSearch
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
