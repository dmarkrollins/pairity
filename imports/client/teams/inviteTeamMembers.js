import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { _ } from 'meteor/underscore'
import { Toast } from '../../client/common/toast'

import { Pairity, Teams, TeamMembers, Organizations, OrganizationMembers, Membership } from '../../lib/pairity'

Template.inviteTeamMembers.onCreated(function () {
    const self = this

    self.loaded = new ReactiveVar(0)
    self.teamId = FlowRouter.getParam('id')

    self.getSearch = () => ({ limit: Pairity.defaultLimit, name: '' })

    self.autorun(function () {
        self.loaded.set(0)
        const search = Session.get(Pairity.OrgMemberSearchKey) || self.getSearch()
        const subscription = self.subscribe('organizationMembers', search)

        if (subscription.ready()) {
            self.loaded.set(1)
        }
    })


    self.addMember = (id) => {
        Meteor.call('teamMemberAdd', self.teamId, id, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showSuccess(`Team member ${response} added successfully!`)
            }
        })
    }

    self.removeMember = (id) => {
        Meteor.call('teamMemberAdd', self.teamId, id, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showSuccess(`Team member ${response} removed successfully!`)
            }
        })
    }
})

Template.inviteTeamMembers.helpers({
    members() {
        if (Template.instance().loaded.get() === 1) {
            return OrganizationMembers.find()
        }
    },
    hasMembers() {
        return true
        // if (Template.instance().loaded.get() === 1) {
        //     return OrganizationMembers.find().count() > 0
        // }
    },
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
    },
    orgName() {
        const membership = Membership.findOne()
        if (membership) {
            return membership.orgName
        }
    },
    currentItem() {
        const instance = Template.instance()
        const members = TeamMembers.find().fetch()
        return {
            data: this,
            addTeamMember: function (id) {
                instance.addMember(id)
            },
            removeTeamMember: function (id) {
                instance.removeMember(id)
            },
            isTeamMember: function (id) {
                const ids = _.pluck(members, 'userId')
                return _.contains(ids, id)
            }
        }
    }
})

Template.inviteTeamMembers.events({
    'input #searchBox': _.debounce(function (event, instance) {
        let search = Session.get(Pairity.OrgMemberSearchKey) || { limit: Pairity.defaultLimit, name: '' }
        if (!_.isObject(search)) {
            search = { limit: Pairity.defaultLimit, name: '' }
        }
        search.name = event.target.value
        search.limit = Pairity.defaultLimit
        Session.set(Pairity.OrgMemberSearchKey, search)
    }, 500)
})
