import { createQuery } from 'meteor/cultofcoders:grapher'

import { PairHistory } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
// import teamMembersList from '../../lib/db/teamMembersListQuery'

class GeneratePairs {
    generate(tid, roles) {
        const members = createQuery({
            teamMembersList: { teamId: tid },
        }).fetch();

        if (!members) {
            throw Errors.create('not-found', 'TeamMembers')
        }

        const history = PairHistory.findOne({ teamId: tid }, { sort: { pairedAt: -1 } })

        let pairs = []

        if (history) {
            pairs = { history }
        }

        if (pairs === []) {
            // load up pairs with members in order
            // save history record
            // return pairs
        }

        // we need to shift and adjust
    }
}

module.exports = { GeneratePairs }
