import { Meteor } from 'meteor/meteor'
import { Pairity, TeamMembers } from '../../../imports/lib/pairity'

TeamMembers._ensureIndex('organizationId', 1)
TeamMembers._ensureIndex('teamId', 1)
TeamMembers._ensureIndex('userId', 1)

Meteor.publish('teamMembers', function (tid) {
    if (!Meteor.userId()) {
        return null
    }

    // console.log('inside the team members pub')

    return TeamMembers.find(
        {
            teamId: tid
        },
        {
            sort: { createdAt: 1 }
        }
    )
})
