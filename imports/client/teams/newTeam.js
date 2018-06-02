import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, Membership } from '../../lib/pairity'
import { Toast } from '../../../imports/client/common/toast'

Template.newTeam.onCreated(function () {
    const self = this

    self.CreateTeam = (team) => {
        const id = Meteor.call('addTeam', team, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                Meteor.call('addUserToTeam', this.state.memberSelected, function (error, response1) {
                    if (error) {
                        Toast.showError(error.reason)
                        // rollback the addTEam transaction if we were not able to add the admin user
                        Meteor.call('removeTeam', id, function (remErr, response2) {
                            if (remErr) {
                                Toast.showError(remErr.reason)
                            }
                        })
                    } else {
                        FlowRouter.go('/teams')
                    }
                })
            }
        })
    }
})

Template.newTeam.helpers({
    saveHandler() {
        const instance = Template.instance();
        return function (team, adminMemberId) {
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
