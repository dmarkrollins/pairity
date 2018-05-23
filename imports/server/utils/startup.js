import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { _ } from 'meteor/underscore'

import { Organizations, OrganizationMembers, Teams } from '../../lib/pairity'

if (Meteor.isServer) {
    Meteor.startup(() => {
        if (Meteor.users.find().count() === 0) {
            console.log('Setting up default admin user...\n') // eslint-disable-line
            const options = {
                username: 'admin',
                email: 'admin@pairity-app.com',
                password: process.env.ADMIN_PW || 'admin',
                isAdmin: true
            }
            Accounts.createUser(options)
        }
    })
}
