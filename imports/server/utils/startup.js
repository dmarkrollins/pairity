import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { _ } from 'meteor/underscore'

import { Logger } from '../../lib/logger'

import { Organizations, OrganizationMembers, Teams } from '../../lib/pairity'

if (Meteor.isServer) {
    Accounts.emailTemplates.from = 'Pairity Administrator <no-reply@6thcents.com>'

    Accounts.emailTemplates.enrollAccount.subject = user => 'Welcome to Pairity!'

    Accounts.emailTemplates.enrollAccount.text = (user, url) =>
        `Your Pairity administrator has invited you to join Pairity.\n\nPairity is a work pairing environment that allows your team to tap into the power of pairing!\n\nAs a Pairity member you can take advantage of team pair management and cross team pair collaboration opportunities within your organization.\n\nUse the link below to get started:\n\n${url}`

    Meteor.startup(() => {
        if (Meteor.users.find().count() === 0) {
            Logger.log('Setting up default admin user...\n') // eslint-disable-line
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
