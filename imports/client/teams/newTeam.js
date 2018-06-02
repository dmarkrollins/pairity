import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, Membership } from '../../lib/pairity'
import { OrganizationMembers } from '../../lib/schemas'
import { Toast } from '../../../imports/client/common/toast'

Template.newTeam.onCreated(function () {
    const self = this

    self.CreateTeam = (team) => {
        const id = Meteor.call('addTeam', team, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            } else {
                let user
                if (this.state.memberSelected) {
                    user = OrganizationMembers.findOne({ _id: this.state.memberSelected })
                    if (!user) {
                        Toast.showError('User not found in organization!')
                        return
                    }
                }
                // TODO: waiting for Dave's code to finish this up
                Meteor.call('addUserToTeam', {
                    userId: this.state.memberSelected,
                    teamId: id,
                    isAdmin: true,
                    organizationId: 0
                }, function (error, response1) {
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
