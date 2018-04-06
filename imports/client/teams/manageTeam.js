import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Pairity, Teams } from '../../../imports/lib/pairity'
import { Toast } from '../../../imports/client/common/toast'

Template.manageTeam.onCreated(function () {
    const self = this

    self.SaveTeam = (team) => {
        Toast.showSuccess('Team information saved successfully!')
    }
    self.SaveRole = (team) => {
        Toast.showSuccess('Role information saved successfully!')
    }
    self.SaveTech = (team) => {
        Toast.showSuccess('Tech information saved successfully!')
    }
    self.RemoveRole = (team) => {
        Toast.showError('Role information removed successfully!')
    }
    self.RemoveTech = (team) => {
        Toast.showError('Tech information removed successfully!')
    }
})

Template.manageTeam.helpers({
    teamName() {
        const t = Teams.findOne()
        if (t) {
            return t.name
        }
    },
    selectedTeam() {
        return Teams.findOne()
    },
    saveHandler() {
        const instance = Template.instance();
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
        const instance = Template.instance();
        return function (item) {
            instance.SaveRole(item)
        }
    },
    roleRemoveHandler() {
        const instance = Template.instance();
        return function (item) {
            instance.RemoveRole(item)
        }
    },
    techSaveHandler() {
        const instance = Template.instance();
        return function (item) {
            instance.SaveTech(item)
        }
    },
    techRemoveHandler() {
        const instance = Template.instance();
        return function (item) {
            instance.RemoveTech(item)
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
    isReady() {
        return FlowRouter.subsReady()
    },
    rolesList() {
        return []
    },
    stackList() {
        return []
    }
})

