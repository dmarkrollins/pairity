import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, Teams, TeamMembers } from '../../lib/pairity'
import { Toast } from '../common/toast'

Template.pairsAssign.onCreated(() => {
    const self = this

    self.setPresence = (id, here) => {
        Meteor.call('toggleMemberPresence', id, here, function (err, response) {
            if (err) {
                Toast.showError(err.reason)
            }
        })
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
            togglePresenceOn: function (id) {
                instance.setPresence(id, true)
            },
            togglePresenceOff: function (id) {
                instance.setPresence(id, false)
            }
        }
    }
})
