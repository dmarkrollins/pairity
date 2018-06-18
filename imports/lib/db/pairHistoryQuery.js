import { Meteor } from 'meteor/meteor'

import { PairHistory } from '../../lib/pairity'

export default PairHistory.createQuery('pairHistoryQuery', {
    $filter({ filters, options, params }) {
        filters.teamId = params.teamId
    },
    $options: {
        sort: { pairedAt: -1 },
        limit: 10
    },
    _id: 1,
    pairedAt: 1,
    pairs: 1
})
