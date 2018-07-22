import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'

import { Pairity, IsTeamAdmin } from '../../lib/pairity'

Template.teamMenu.onRendered(function () {
    if (this.data.selectedItem) {
        $(`#${this.data.selectedItem}`).addClass('bolded-link')
    }
})

Template.teamMenu.helpers({
    teamId() {
        return Session.get(Pairity.SELECTED_TEAM)
    },
    teamAdmin() {
        const id = FlowRouter.getParam('id')
        return IsTeamAdmin({ _id: id }, Meteor.userId())
    }
})
