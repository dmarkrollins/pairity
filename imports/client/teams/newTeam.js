import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, Membership } from '../../lib/pairity'
import { Toast } from '../../../imports/client/common/toast'

Template.newTeam.onCreated(function () {
    const self = this

    self.CreateTeam = (team) => {
        Meteor.call('addTeam', team, function (err, response) {
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
        return function (team) {
            instance.CreateTeam(team)
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
    }
})
