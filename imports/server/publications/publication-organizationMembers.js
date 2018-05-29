import { Meteor } from 'meteor/meteor'
import { publishComposite } from 'meteor/reywood:publish-composite'

import { Pairity, OrganizationMembers } from '../../../imports/lib/pairity'

OrganizationMembers._ensureIndex('organizationId', 1)

OrganizationMembers._ensureIndex('userId', 1)

OrganizationMembers._ensureIndex('status', 1)

publishComposite('organizationMembers', function (orgId) {
    // console.log('retrieving members', OrganizationMembers.find({ organizationId: orgId }).count())

    return {
        find() {
            return OrganizationMembers.find({ organizationId: orgId }, { limit: 10 });
        },

        children: [{
            find(member) {
                return Meteor.users.find({ _id: member.userId }, { fields: { username: 1, emails: 1, userPreferences: 1 } });
            }
        }]
    }
})
