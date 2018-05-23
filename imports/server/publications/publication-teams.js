import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Pairity, Teams, TeamMembers, Organizations, OrganizationMembers } from '../../../imports/lib/pairity'

Teams._ensureIndex('name', 1)

Meteor.publish('allTeams', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    let searchVal

    if (!search) {
        searchVal = ''
    } else {
        searchVal = search.name || ''
    }

    const searchLimit = search.limit || Pairity.defaultLimit

    const membership = OrganizationMembers.findOne({ userId: this.userId })

    const orgid = membership.isAdmin ? membership.organizationId : ''

    const teams = TeamMembers.find({ userId: Meteor.userId() }).fetch()

    const teamids = _.pluck(teams, 'teamId')

    return Teams.find(
        {
            name: { $regex: searchVal, $options: 'i' },
            $or: [
                { _id: { $in: teamids } },
                { organizationId: orgid },
            ]
        },
        {
            sort: { name: 1 },
            limit: searchLimit
        }
    )
})

Meteor.publish('singleTeam', function (id) {
    if (!Meteor.userId()) {
        return null
    }

    return Teams.find({
        _id: id
    })
})
