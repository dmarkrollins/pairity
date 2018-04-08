import { Meteor } from 'meteor/meteor'
import { Pairity, Teams, TeamRoles } from '../../../imports/lib/pairity'

TeamRoles._ensureIndex('teamId', 1)
TeamRoles._ensureIndex('name', 1)

Meteor.publish('teamRoles', function (teamId) {
    if (!Meteor.userId()) {
        return null
    }

    return TeamRoles.find({
        teamId: teamId
    })
})
