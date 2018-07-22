import { Meteor } from 'meteor/meteor'
import { Teams } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
import TeamMembersListQuery from '../../lib/db/teamMembersListQuery'

TeamMembersListQuery.expose({
    firewall(userId, params) {
        if (!userId) {
            Errors.throw('not-logged-in')
        }

        const t = Teams.findOne(params.teamId)

        if (!t) {
            Errors.throw('not-found', 'Team')
        }

        // in the firewall you also have the ability to modify the parameters
        // that are going to hit the $filter() function in the query

        // the firewall runs in the Meteor.methods or Meteor.publish context
        // Meaning you can have access to this.userId and others.
    },
    publication: true
})
