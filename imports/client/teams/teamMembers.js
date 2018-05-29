import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Pairity, Teams, TeamMembers } from '../../lib/pairity'
import { Toast } from '../../client/common/toast'

Template.teamMembers.onCreated(function () {
    const self = this

    self.RemoveMember = (id) => {
        Toast.showSuccess('Member removed successfully!')
    }

    self.ToggleAdmin = (id) => {
        Toast.showWarning('Member toggled successfully!')
    }
})

Template.teamMembers.helpers({
    teamName() {
        const t = Teams.findOne()
        if (t) {
            return t.name
        }
    },
    noMembers() {
        return true
    },
    currentItem() {
        const instance = Template.instance()
        return {
            data: this,
            removeFromTeam: function (id) {
                instance.RemoveMember(id)
            },
            toggleAdmin: function (id) {
                instance.ToggleAdmin(id)
            }
        }
    }
})
