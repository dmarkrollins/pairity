import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, Organizations } from '../../lib/pairity'
import { Toast } from '../../../imports/client/common/toast'

Template.editOrganization.onCreated(function () {
    const self = this

    self.UpdateOrganization = (org) => {
        Meteor.call('updateOrganization', org, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                FlowRouter.go('/organizations')
            }
        })
    }

    self.removeOrganization = (org) => {
        Meteor.call('removeOrganization', org, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                FlowRouter.go('/organizations')
            }
        })
    }
})

Template.editOrganization.helpers({
    saveHandler() {
        const instance = Template.instance();
        return function (org) {
            instance.UpdateOrganization(org)
        }
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/organizations')
        }
    },
    orgItem() {
        return Pairity.Components.OrganizationItem
    },
    isReady() {
        return FlowRouter.subsReady()
    },
    selectedOrg() {
        return Organizations.findOne()
    },
})
