import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { _ } from 'meteor/underscore'
import { $ } from 'meteor/jquery'
import { Pairity, Teams, TeamMembers } from '../../lib/pairity'
import { Toast } from '../common/toast'
import { AmplifiedSession } from '../common/amplify'

Template.pairsAssign.onCreated(function () {
    const self = this
    self.needMoreThan1 = new ReactiveVar(true)
    self.selectCount = new ReactiveVar(0)
    self.setPresence = (teamMemberId, here) => {
        Meteor.call('toggleMemberPresence', teamMemberId, here, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            }
        })
    }

    self.setRole = (checked, role) => {
        let roles = AmplifiedSession.get(Pairity.AmplifiedKeys.ROLE_FILTER)
        if (!roles) {
            roles = []
        }
        if (checked) {
            roles = _.reject(roles, item => item === role)
            roles.push(role)
        } else {
            roles = _.reject(roles, item => item === role)
        }
        AmplifiedSession.set(Pairity.AmplifiedKeys.ROLE_FILTER, roles)
    }

    self.membersAreSelected = () => {
        let retval = 'pure-button-disabled'
        const roles = AmplifiedSession.get(Pairity.AmplifiedKeys.ROLE_FILTER)
        const members = TeamMembers.find().fetch()
        if (roles) {
            if (members.length > 0) {
                let readyCount = 0
                members.forEach((member) => {
                    const user = Meteor.users.findOne(member.userId)
                    if (user) {
                        if (member.isPresent) {
                            if (_.contains(roles, user.userPreferences.primaryRole)) {
                                readyCount += 1
                            }
                        }
                    }
                })
                self.selectCount.set(readyCount)
                switch (readyCount) {
                    case 0:
                        self.needMoreThan1.set(false)
                        break;
                    case 1:
                        self.needMoreThan1.set(true)
                        break;
                    default:
                        retval = ''
                        self.needMoreThan1.set(false)
                        break
                }
            }
        }
        return retval
    }
})

Template.pairsAssign.helpers({
    teamName() {
        const t = Teams.findOne()
        if (t) {
            return t.name
        }
    },
    member() {
        return TeamMembers.find()
    },
    currentItem() {
        const instance = Template.instance()
        return {
            data: this,
            selectedRoles: instance.selectedRoles,
            togglePresenceOn: function (teamMemberId) {
                instance.setPresence(teamMemberId, true)
            },
            togglePresenceOff: function (teamMemberId) {
                instance.setPresence(teamMemberId, false)
            }
        }
    },
    engineeringChecked() {
        const roles = AmplifiedSession.get('roleFilter')
        if (roles) {
            return _.contains(roles, Pairity.MemberRoles.ENGINEER)
        }
        return false
    },
    designChecked() {
        const roles = AmplifiedSession.get('roleFilter')
        if (roles) {
            return _.contains(roles, Pairity.MemberRoles.DESIGN)
        }
        return false
    },
    productChecked() {
        const roles = AmplifiedSession.get('roleFilter')
        if (roles) {
            return _.contains(roles, Pairity.MemberRoles.PRODUCT)
        }
        return false
    },
    generateDisabled() {
        return Template.instance().membersAreSelected()
    },
    isReady() {
        return FlowRouter.subsReady()
    },
    showMoreThan1() {
        return Template.instance().needMoreThan1.get()
    },
    selectedText() {
        const count = Template.instance().selectCount.get()
        if (count > 1) {
            return `${count} members selected`
        }
        if (count === 1) {
            return `${count} member selected`
        }
        return '0 members selected'
    }
})

Template.pairsAssign.events({
    'click #cbEngineering': function (event, instance) {
        instance.setRole(event.target.checked, Pairity.MemberRoles.ENGINEER)
    },
    'click #cbProduct': function (event, instance) {
        instance.setRole(event.target.checked, Pairity.MemberRoles.PRODUCT)
    },
    'click #cbDesign': function (event, instance) {
        instance.setRole(event.target.checked, Pairity.MemberRoles.DESIGN)
    }
})
