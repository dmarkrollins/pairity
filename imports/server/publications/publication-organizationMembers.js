import { Meteor } from 'meteor/meteor'
import { Pairity, OrganizationMembers } from '../../../imports/lib/pairity'

OrganizationMembers._ensureIndex('organizationId', 1)
OrganizationMembers._ensureIndex('userId', 1)

OrganizationMembers._ensureIndex(
    { organizationId: 1, userId: 1 },
    { unique: true }
)

Meteor.publish('organizationMembers', function (uId) {
    if (!Meteor.userId()) {
        return null
    }

    return OrganizationMembers.find(
        {
            userId: uId
        },
        {
            sort: { createdAt: 1 }
        }
    )
})
