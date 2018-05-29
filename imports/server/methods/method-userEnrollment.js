import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Accounts } from 'meteor/accounts-base'
import { Pairity, OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'

Meteor.methods({
    userEnrollment: function (name) {
        if (!this.userId) {
            throw Errors.create('not-logged-in') // should not be logged in at this point
        }

        try {
            Accounts.setUsername(this.userId, name)
        } catch (err) {
            Logger.log(err)
            throw Errors.create('custom', 'User name already exists try something different.')
        }

        const member = OrganizationMembers.findOne({ userId: this.userId })

        if (!member) {
            throw Errors.create('not-found', 'Membership')
        }

        try {
            OrganizationMembers.update(
                {
                    _id: member._id
                },
                {
                    $set: {
                        status: Pairity.MemberStatuses.MEMBER_ACTIVE
                    }
                }
            )

            if (member.isAdmin) {
                return '/organizations'
            }

            return '/teams'
        } catch (err) {
            if (err.sanitizedError) {
                Logger.log('Enrollment failed', this.userId, err.sanitizedError.reason)
                throw new Meteor.Error('update-failed', err.sanitizedError.reason)
            } else {
                Logger.log('Enrollment failed', this.userId, err)
                throw new Meteor.Error('update-failed', 'User not added to organization - please try again later!')
            }
        }
    }
})
