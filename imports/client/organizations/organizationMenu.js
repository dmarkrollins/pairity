import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import moment from 'moment'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery'

import { Toast } from '../../../imports/client/common/toast'
import { Pairity, Organizations } from '../../lib/pairity'
import { PairityModal } from '../common/pairityModal'

Template.organizationMenu.onCreated(function () {
    const self = this

    self.removeOrganization = (id) => {
        Toast.showSuccess('Organization successfully removed!')
        FlowRouter.go('/organizations')
    }
})

Template.organizationMenu.onRendered(function () {
    $('div.sub-menu a').removeClass('bolded-link')
    const itemId = `#${this.data.highlight}`
    $(itemId).addClass('bolded-link')
})

Template.organizationMenu.helpers({
    orgId() {
        const org = Organizations.findOne()
        if (org) {
            return org._id
        }
    },
    isAdmin() {
        return Meteor.user().username === 'admin'
    }
})

Template.organizationMenu.events({
    'click #menuRemove': function (event, instance) {
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
    'click #menuManage': function (event, instance) {
        const org = Organizations.findOne()
        if (org) {
            FlowRouter.go(`/organizations/edit/${org._id}`)
        }
    },
    'click #menuInvite': function (event, instance) {
        const org = Organizations.findOne()
        if (org) {
            FlowRouter.go(`/organizations/invite/${org._id}`)
        }
    }
})
