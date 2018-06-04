import { Meteor } from 'meteor/meteor'
import { publishComposite } from 'meteor/reywood:publish-composite'

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

publishComposite('assigmentMembers', function (tid, limit) {
    const searchLimit = limit || Pairity.defaultLimit

    return {
        find() {
            return TeamMembers.find({ teamId: tid });
        },
        children: [{
            find(member) {
                return Meteor.users.find({ _id: member.userId }, { fields: { username: 1, emails: 1, userPreferences: 1 } });
            }
        }]
    }
})

