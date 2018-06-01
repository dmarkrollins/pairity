import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Teams, TeamMembers, Membership } from '../../lib/pairity'

Template.teamMenu.onRendered(function () {
    if (this.data.selectedItem) {
        $(`#${this.data.selectedItem}`).addClass('bolded-link')
    }
})

Template.teamMenu.helpers({
    teamId() {
        const t = Teams.findOne()
        if (t) {
            return t._id
        }
    },
    isTeamAdmin() {
        const t = FlowRouter.getParam('id')
        const team = Teams.findOne()
        const tm = TeamMembers.findOne({ userId: Meteor.userId(), teamId: t._id })
        const membership = Membership.findOne()
        if (membership) {
            if (membership.isOrgAdmin === true) return true
        }
        if (tm) {
            if (tm.isAdmin === true) return true
        }
        return false
    }
})
