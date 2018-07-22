import { Meteor } from 'meteor/meteor'
import { Teams, Organizations, TeamMembers } from '../pairity'

TeamMembers.addLinks({
    team: {
        type: 'one',
        collection: Teams,
        field: 'teamId',
    },
    organization: {
        type: 'one',
        collection: Organizations,
        field: 'organizationId',
    },
    user: {
        type: 'one',
        collection: Meteor.users,
        field: 'userId',
    }
})
