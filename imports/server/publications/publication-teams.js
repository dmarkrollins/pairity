import { Meteor } from 'meteor/meteor'
import { Pairity, Teams } from '../../../imports/lib/pairity'

Teams._ensureIndex('name', 1)

Meteor.publish('allTeams', function (search) {
    if (!Meteor.userId()) {
        return null
    }

    let searchVal
    let searchLimit

    if (!search) {
        searchVal = ''
        searchLimit = 10
    } else {
        searchVal = search.name || ''
        searchLimit = search.limit || 10
    }

    return Teams.find(
        {
            name: { $regex: searchVal, $options: 'i' }
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
