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
            self.loaded.set(OrganizationMembers.find().count())
        }
    })

    self.addMember = (orgMemberId) => {
        Meteor.call('teamMemberAdd', self.teamId, orgMemberId, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showSuccess(`Team member ${response} added successfully!`)
            }
        })
    }

    self.removeMember = (orgMemberId) => {
        Meteor.call('teamMemberRemove', self.teamId, orgMemberId, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showWarning(`Team member ${response} removed successfully!`)
            }
        })
    }

    self.isTeamMember = (userid) => {
        const m = TeamMembers.findOne({ teamId: self.teamId, userId: userid })
        if (m) {
            return true
        }
        return false
    }
})

Template.inviteTeamMembers.onRendered(function (){
    setTimeout(function(){
        $('#searchBox').focus()
    }, 1000)
})

Template.inviteTeamMembers.helpers({
    members() {
        return OrganizationMembers.find({}, { sort: { username: 1 } })
    },
    hasMembers() {
        return Template.instance().loaded.get() > 0
    },
    teamName() {
        const t = Teams.findOne()
        if (t) {
            return t.name
        }
    },
    hasMoreMembers() {
        const instance = Template.instance()
        const search = Session.get(Pairity.OrgMemberSearchKey) || instance.getSearch()
        return instance.loaded.get() === search.limit
    },
    orgName() {
        const membership = Membership.findOne()
        if (membership) {
            return membership.orgName
        }
    },
    currentItem() {
        const instance = Template.instance()
        return {
            data: this,
            addTeamMember: function (orgMemberId) {
                instance.addMember(orgMemberId)
            },
            removeTeamMember: function (orgMemberId) {
                instance.removeMember(orgMemberId)
            },
            isTeamMember: function (userId) {
                return instance.isTeamMember(userId)
            }
        }
    },
    searchVal() {
        const search = Session.get(Pairity.OrgMemberSearchKey)
        if (search) {
            return search.name || ''
        }
    }
})

Template.inviteTeamMembers.events({
    'input #searchBox': _.debounce(function (event, instance) {
        const search = instance.getSearch() // start fresh
        search.name = event.target.value
        Session.set(Pairity.OrgMemberSearchKey, search)
        setTimeout(function(){
            $('#searchBox').focus()
        }, 1000)
    }, 500),
    'click #btnMore': function (event, instance) {
        const search = Session.get(Pairity.OrgMemberSearchKey) || instance.getSearch()
        search.limit += Pairity.defaultLimit
        Session.set(Pairity.OrgMemberSearchKey, search)
        setTimeout(function(){
            $('#searchBox').focus()
        }, 1000)
    }
})
