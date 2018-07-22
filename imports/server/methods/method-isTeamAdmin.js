import { Meteor } from 'meteor/meteor'
import { TeamMembers } from '../../lib/pairity'


Meteor.methods({
    isTeamAdmin(team) {
        if (!this.userId) {
            return false
        }
        const member = TeamMembers.findOne({ teamId: team._id, userId: this.userId })

        if (member) {
            return member.isAdmin
        }

        const user = Meteor.users.findOne(this.userId)

        const response = (user.username === 'admin')

        return response
    }
})
