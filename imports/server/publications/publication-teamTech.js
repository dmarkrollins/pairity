import { Meteor } from 'meteor/meteor'
import { Pairity, Teams, TeamTech } from '../../../imports/lib/pairity'

TeamTech._ensureIndex('teamId', 1)
TeamTech._ensureIndex('name', 1)

Meteor.publish('teamTech', function (teamId) {
    if (!Meteor.userId()) {
        return null
    }

    return TeamTech.find({
        teamId: teamId
    })
})
