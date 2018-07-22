import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'

Meteor.methods({
    setUserPreferences: function (role) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
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
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('Preferences update failed', this.userId, err)
                Errors.throw('update-failed', 'Preferences')
            }
        }
    },
    resetUserPassword: function (newPassword) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        try {
            Accounts.setPassword(this.userId, newPassword, { logout: false })
        } catch (err) {
            if (err.sanitizedError) {
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('password reset failed', this.userId, err)
                Errors.throw('update-failed', 'Password Reset')
            }
        }
    }
})
