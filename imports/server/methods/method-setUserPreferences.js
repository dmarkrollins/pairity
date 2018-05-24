import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'

import { Pairity, Teams, TeamTech, IsTeamAdmin } from '../../../imports/lib/pairity'
// import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    setUserPreferences: function (role) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }

        const prefs = {
            primaryRole: role
        }

        try {
            Meteor.users.update(
                this.userId,
                {
                    $set: {
                        userPreferences: prefs
                    }
                }
            )
        } catch (err) {
            if (err.sanitizedError) {
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                Logger.log('Preferences update failed', this.userId, err)
                throw Errors.create('update-failed', 'Preferences')
            }
        }
    },
    resetUserPassword: function (newPassword) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }

        try {
            Accounts.setPassword(this.userId, newPassword, { logout: false })
        } catch (err) {
            if (err.sanitizedError) {
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                Logger.log('password reset failed', this.userId, err)
                throw Errors.create('update-failed', 'Password Reset')
            }
        }
    }
})
