import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Pairity, Teams, TeamMembers, Organizations, OrganizationMembers, Membership } from '../../lib/pairity'

Template.inviteTeamMembers.onCreated(function () {
    const self = this

    self.loaded = new ReactiveVar(0)
    self.teamId = FlowRouter.getParam('teamId')

    self.autorun(function () {
        const search = Session.get(Pairity.TeamSearchKey) || { limit: self.limit, name: '' }
        const subscription = self.subscribe('organizationMembers', search)

        if (subscription.ready()) {
            self.loaded.set(Teams.find().count())
        }
    })

    self.getSearch = () => ({ limit: Pairity.defaultLimit, name: '' })
})

Template.inviteTeamMembers.helpers({
    teamName() {
        const t = Teams.findOne()
        if (t) {
            return t.name
        }
    },
    isTeamMember() {
        const instance = Template.instance()
        const m = TeamMembers.findOne({ teamId: instance.teamId, userId: this.userId })
        if (m) {
            return true
        }
        return false
    },
    hasMoreMembers() {
        return false
    }
})
