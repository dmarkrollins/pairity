import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Accounts } from 'meteor/accounts-base'
import { Pairity, IsTeamAdmin, Organizations, OrganizationMembers } from '../../lib/pairity'
import { Logger } from '../../lib/logger'
import { Errors } from '../../lib/errors'

Meteor.methods({
    inviteOrganizationMember: function (orgId, email, admin) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        const org = Organizations.findOne(orgId)

        if (!org) {
            Errors.throw('not-found', 'Organization')
        }

        const user = Accounts.findUserByEmail(email)

        if (user) {
            const member = OrganizationMembers.findOne({ userId: user._id })
            if (member) {
                Errors.throw('custom', 'User is already a member of an organization!')
            }
        }

        try {
            let orguserId
            if (!user) {
                orguserId = Accounts.createUser({ email })
            } else {
                orguserId = user._id
            }

            const retVal = OrganizationMembers.insert(
                {
                    organizationId: orgId,
                    userId: orguserId,
                    status: Pairity.MemberStatuses.MEMBER_PENDING,
                    isAdmin: admin
                },
                {
                    extendAutoValueContext:
                    {
                        isInsert: false,
                        isUpdate: true,
                        isUpsert: false,
                        isFromTrustedCode: true,
                        userId: this.userId
                    }
                }
            )

            try {
                Accounts.sendEnrollmentEmail(orguserId)
            } catch (err) {
                Logger.log('Send enrollment email error', err)
                Errors.throw('custom', 'Enrollment email could not be sent. Please try again later.')
            }

            return retVal
        } catch (err) {
            Logger.log('Invite org member failed', orgId, email, admin, err)
            if (err.sanitizedError) {
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Errors.throw('custom', err.reason)
            }
        }
    }
})
