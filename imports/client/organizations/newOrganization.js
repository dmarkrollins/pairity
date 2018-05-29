import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity } from '../../lib/pairity'
import { Toast } from '../../../imports/client/common/toast'

Template.newOrganization.onCreated(function () {
    const self = this

    self.CreateOrganization = (org) => {
        Meteor.call('addOrganization', org, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                FlowRouter.go('/organizations')
            }
        })
    }
})

Template.newOrganization.helpers({
    saveHandler() {
        const instance = Template.instance();
        return function (org) {
            instance.CreateOrganization(org)
        }
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/organizations')
        }
    },
    orgItem() {
        return Pairity.Components.OrganizationItem
    }

})
