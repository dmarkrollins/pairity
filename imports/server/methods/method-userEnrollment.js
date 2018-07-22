import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Pairity, OrganizationMembers } from '../../lib/pairity'
import { Logger } from '../../lib/logger'
import { Errors } from '../../lib/errors'

Meteor.methods({
    userEnrollment: function (name) {
        if (!this.userId) {
            Errors.throw('not-logged-in') // should not be logged in at this point
        }

        try {
            Accounts.setUsername(this.userId, name)
        } catch (err) {
            Logger.log(err)
            Errors.throw('custom', 'User name already exists try something different.')
        }

        const user = Meteor.users.findOne({ _id: this.userId })

        const member = OrganizationMembers.findOne({ userId: this.userId })

        if (!member) {
            Errors.throw('not-found', 'Membership')
        }

        try {
            OrganizationMembers.update(
                {
                    _id: member._id
                },
                {
                    $set: {
                        status: Pairity.MemberStatuses.MEMBER_ACTIVE,
                        username: name,
                        email: user.email[0].address
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
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('Enrollment failed', this.userId, err)
                Errors.throw('update-failed', 'Organization')
            }
        }
    }
})
