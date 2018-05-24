import { Template } from 'meteor/templating'
import moment from 'moment'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Toast } from '../../../imports/client/common/toast'
import { Pairity, Organizations } from '../../lib/pairity'
import { PairityModal } from '../common/pairityModal'

Template.organizationMenu.onCreated(function () {
    const self = this

    self.removeOrganization = (id) => {
        console.log('hey there', id)
        Toast.showSuccess('Organization successfully removed!')
        FlowRouter.go('/organizations')
    }
})

Template.organizationMenu.onRendered(function () {
    this.$('div.sub-menu a').removeClass('bolded-link')
    this.$(`#${this.data.highlight}`).addClass('bolded-link')
})

Template.organizationMenu.helpers({
    orgId() {
        const org = Organizations.findOne()
        if (org) {
            return org._id
        }
    }
})

Template.organizationMenu.events({
    'click #btnRemove': function (event, instance) {
        const self = instance

        const org = Organizations.findOne()

        if (!org) return

        const title = 'Remove Organization?'
        const body = `Are you sure you want to remove organization "${org.name}"?<p>All related user and pairing history will be PERMANENTLY destroyed!</p>`
        const okText = 'Remove'

        PairityModal.show(title, body, okText, (id) => {
            self.removeOrganization(id)
        }, org._id, 'modal-header-danger')
    },
    'click #btnManage': function (event, instance) {
        const org = Organizations.findOne()
        if (org) {
            FlowRouter.go(`/organizations/edit/${org._id}`)
        }
    },
    'click #btnInvite': function (event, instance) {
        const org = Organizations.findOne()
        if (org) {
            FlowRouter.go(`/organizations/invite/${org._id}`)
        }
    }
})
