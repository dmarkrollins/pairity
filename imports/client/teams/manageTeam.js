import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

import TeamMembersListQuery from '../../lib/db/teamMembersListQuery'
import { Pairity, Teams, TeamMembers } from '../../lib/pairity'
import { Toast } from '../common/toast'

Template.manageTeam.onCreated(function () {
    const self = this

    self.selectedTeamId = FlowRouter.getParam('id')

    self.SaveTeam = (team) => {
        Meteor.call('updateTeam', team, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Toast.showSuccess('Team information saved successfully!')
            }
        })
    }
    self.SaveRole = (teamId, roleName) => {
        Meteor.call('addTeamRole', teamId, roleName, function (err, response) {
            if (err) {
                Toast.showError(err.reason, 5000)
            }
        })
    }
    self.SaveTech = (teamId, techName) => {
        Meteor.call('addTeamTech', teamId, techName, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            }
        })
    }
    self.RemoveRole = (teamId, roleName) => {
        Meteor.call('removeTeamRole', teamId, roleName, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            }
        })
    }
    self.RemoveTech = (teamId, techName) => {
        Meteor.call('removeTeamTech', teamId, techName, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            }
        })
    }

    const teamId = FlowRouter.getParam('id');

    self.memberQuery = TeamMembersListQuery.clone({ teamId });
    self.membersHandle = self.memberQuery.subscribe()
})

Template.manageTeam.helpers({
    teamName() {
        const t = Teams.findOne(Template.instance().selectedTeamId)
        if (t) {
            return t.name
        }
    },
    teamMembers() {
        return Template.instance().memberQuery.fetch()
    },
    isReady() {
        return FlowRouter.subsReady() && Template.instance().membersHandle.ready()
    },
    selectedTeam() {
        return Teams.findOne(Template.instance().selectedTeamId)
    },
    saveHandler() {
        const instance = Template.instance();
        const t = Teams.findOne(Template.instance().selectedTeamId)
        if (!t) return
        return function (team) {
            instance.SaveTeam(team)
        }
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/teams')
        }
    },
    roleSaveHandler() {
        const instance = Template.instance()
        const t = Teams.findOne(Template.instance().selectedTeamId)
        if (!t) return
        return function (item) {
            instance.SaveRole(t._id, item)
        }
    },
    roleRemoveHandler() {
        const instance = Template.instance();
        const t = Teams.findOne(Template.instance().selectedTeamId)
        if (!t) return
        return function (item) {
            instance.RemoveRole(t._id, item)
        }
    },
    techSaveHandler() {
        const instance = Template.instance();
        const t = Teams.findOne(Template.instance().selectedTeamId)
        if (!t) return
        return function (item) {
            instance.SaveTech(t._id, item)
        }
    },
    techRemoveHandler() {
        const instance = Template.instance();
        const t = Teams.findOne()
        return function (item) {
            instance.RemoveTech(t._id, item)
        }
    },

    subItemStackRemoveHandler() {
        const instance = Template.instance();
        return function (team) {
            instance.SaveStackItem(team)
        }
    },
    teamItem() {
        return Pairity.Components.TeamItem
    },
    teamSubItem() {
        return Pairity.Components.TeamSubItem
    },
    rolesList() {
        const t = Teams.findOne()
        if (!t) return []
        const roleArray = []

        if (!t.roles) {
            return []
        }

        t.roles.forEach((role) => {
            roleArray.push({ label: role, value: role })
        })
        return roleArray
    },
    stackList() {
        const t = Teams.findOne()
        if (!t) return []
        const techArray = []

        if (!t.technologies) {
            return []
        }

        t.technologies.forEach((tech) => {
            techArray.push({ label: tech, value: tech })
        })
        return techArray
    }
})
