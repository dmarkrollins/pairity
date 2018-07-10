import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, OrganizationMembers, Membership } from '../../lib/pairity'
import { Toast } from '../../../imports/client/common/toast'

Template.newTeam.onCreated(function () {
    const self = this

    self.CreateTeam = (team, teamAdmin) => {
        Meteor.call('addTeam', team, teamAdmin, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                FlowRouter.go('/teams')
            }
        })
    }
})

Template.newTeam.helpers({
    saveHandler() {
        const instance = Template.instance();

        return function (team, teamAdmin) {
            instance.CreateTeam(team, teamAdmin)
        }
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/teams')
        }
    },
    teamItem() {
        return Pairity.Components.TeamItem
    },
    selectedTeam() {
        const memship = Membership.findOne()
        if (memship) {
            return { organizationId: memship.organizationId }
        }
    },
    orgMembers() {
        return OrganizationMembers.find({ isAdmin: true }).fetch();
    }
})
