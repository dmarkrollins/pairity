import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Accounts } from 'meteor/accounts-base'
import { Pairity, OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'

Meteor.methods({
    userEnrollment: function (token, name, password) {
        if (this.userId) {
            throw Errors.create('logged-in') // should not be logged in at this point
        }

        Accounts.resetPassword(token, password, function (error) {
            if (error) {
                throw Errors.create('custom', error)
            }

            // user is now logged in

            const member = OrganizationMembers.findOne({ userId: this.userId })

            if (!member) {
                throw Errors.create('not-found', 'Membership')
            }

            if (member.isAdmin) {
                return '/organizations'
            }

            return '/teams'
        })
    }
})
