import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Pairity, Teams } from '../../../imports/lib/pairity'
import { Toast } from '../../../imports/client/common/toast'

Template.manageTeam.onCreated(function () {
    const self = this

    self.SaveTeam = (team) => {
        Toast.showWarning('Team information saved successfully!')
    }

    self.SaveRole = (team) => {
        Toast.showWarning('Role information saved successfully!')
    }

    self.SaveTech = (team) => {
        Toast.showWarning('Tech information saved successfully!')
    }
})

Template.manageTeam.helpers({
    team() {
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
        return function (team) {
            instance.SaveRole(team)
        }
    },
    techSaveHandler() {
        const instance = Template.instance();
        return function (team) {
            instance.SaveTech(team)
        }
    }
})

