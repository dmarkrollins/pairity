import { Meteor } from 'meteor/meteor'
import { Teams, PairHistory } from '../pairity'

PairHistory.addLinks({
    member1: {
        type: 'one',
        collection: Meteor.users,
        field: 'pairs.memberOne',
    },
    member2: {
        type: 'one',
        collection: Meteor.users,
        field: 'pairs.memberTwo',
    },
    member3: {
        type: 'one',
        collection: Meteor.users,
        field: 'pairs.memberThree',
    },
    team: {
        type: 'one',
        collection: Teams,
        field: 'teamId'
    }
})
