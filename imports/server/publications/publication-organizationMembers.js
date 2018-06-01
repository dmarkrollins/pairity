import { Meteor } from 'meteor/meteor'
import { publishComposite } from 'meteor/reywood:publish-composite'
import { _ } from 'meteor/underscore'

import { Pairity, OrganizationMembers, Organizations } from '../../../imports/lib/pairity'

OrganizationMembers._ensureIndex('organizationId', 1)

OrganizationMembers._ensureIndex('userId', 1)

OrganizationMembers._ensureIndex('status', 1)

OrganizationMembers._ensureIndex('username', 1)

publishComposite('inviteMembers', function (orgId, limit) {
    // console.log('retrieving members', OrganizationMembers.find({ organizationId: orgId }).count())

    const searchLimit = limit || Pairity.defaultLimit

    return {
        find() {
            return OrganizationMembers.find({ organizationId: orgId, status: Pairity.MemberStatuses.MEMBER_PENDING }, { limit: searchLimit });
        },

        children: [{
            find(member) {
                return Meteor.users.find({ _id: member.userId }, { fields: { username: 1, emails: 1, userPreferences: 1 } });
            }
        }]
    }
})

Meteor.publish('organizationMembers', function (search) {
    if (!this.userId) {
        return null
    }

    const searchVal = search.name || ''
    const searchLimit = search.limit || Pairity.defaultLimit

    const orgMember = OrganizationMembers.findOne({ userId: this.userId })

    const user = Meteor.users.find({ _id: this.userId })

    if (!orgMember && user.username !== 'admin') {
        return null
    }

    const orgIds = []

    if (user.username === 'admin') {
        // all orgs
        orgIds.push(_.pluck(Organizations.find().fetch(), '_id'))
    } else {
        // only the one you are in
        orgIds.push(orgMember.organizationId)
    }

    return OrganizationMembers.find(
        {
            organizationId: { $in: orgIds },
            status: Pairity.MemberStatuses.MEMBER_ACTIVE,
            username: { $regex: searchVal, $options: 'i' }
        },
        {
            $sort: { username: 1 },
            limit: searchLimit
        }
    )
})
