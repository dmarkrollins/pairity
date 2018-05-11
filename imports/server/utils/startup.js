import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

import { Organizations, OrganizationMembers, Teams } from '../../lib/pairity'

if (Meteor.isServer && !Meteor.isTest) {
    Meteor.startup(() => {
        // add accoutrements
        const teams = Teams.find({}).fetch()
        const orgs = Organizations.find({}).count()

        if (teams.length !== 0 && orgs === 0) {
            const users = Meteor.users.find().fetch()

            const userids = _.pluck(users, '_id')

            console.log('============================\nPerforming data updates\n============================') // eslint-disable-line

            console.log('creating new fake org and assigning all existing users as admin') // eslint-disable-line
            const orgId = Organizations.insert({
                name: 'Test Organization',
                admins: userids,
                createdAt: new Date()
            })

            console.log('updating all team records') // eslint-disable-line
            teams.forEach((team) => {
                Teams.update(
                    {
                        _id: team._id
                    },
                    {
                        $set: {
                            organizationId: orgId
                        }
                    }
                )
            })
        }
    });
}
