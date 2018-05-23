import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Pairity, Teams, TeamMembers, Organizations } from '../../../imports/lib/pairity'

Teams._ensureIndex('name', 1)

Meteor.publish('allOrgs', function () {
    if (!Meteor.userId()) {
        return null
    }

    return Organizations.find({}, { sort: { name: 1 } })
})

Meteor.publish('singleOrg', function (id) {
    if (!Meteor.userId()) {
        return null
    }

    return Organizations.find({
        _id: id
    })
})
