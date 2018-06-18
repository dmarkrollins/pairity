import { Meteor } from 'meteor/meteor'
import PairHistoryQuery from '../../lib/db/pairHistoryQuery'

PairHistoryQuery.expose({
    firewall(userId, params) {
        if (!userId) {
            throw new Meteor.Error('not-allowed')
        }

        // in the firewall you also have the ability to modify the parameters
        // that are going to hit the $filter() function in the query

        // the firewall runs in the Meteor.methods or Meteor.publish context
        // Meaning you can have access to this.userId and others.
    }
})
