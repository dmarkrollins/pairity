import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Accounts } from 'meteor/accounts-base'
import { Pairity, IsTeamAdmin, Organizations, OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'

Meteor.methods({
    inviteOrganizationMember: function (orgId, email, admin) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }

        const org = Organizations.findOne(orgId)

        if (!org) {
            throw Errors.create('not-found', 'Organization')
        }

        const user = Accounts.findUserByEmail(email)

        if (user) {
            throw Errors.create('duplicate-found', 'OrganizationMember')
        }

        try {
            const orguserId = Accounts.createUser({ email })

            Accounts.sendEnrollmentEmail(orguserId)

            const retVal = OrganizationMembers.insert(
                {
                    orgId: orgId,
                    userId: orguserId,
                    status: Pairity.MemberStatuses.MEMBER_PENDING,
                    isAdmin: admin,

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
            return retVal.nModified
        } catch (err) {
            Logger.log('Enrollment failed', this.userId, err)
            if (err.sanitizedError) {
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                throw Errors.create('custom', 'Enrollment failed - please try again later.')
            }
        }
    }
})
