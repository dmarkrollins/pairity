import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Accounts } from 'meteor/accounts-base'
import { Pairity, IsTeamAdmin, Organizations, OrganizationMembers } from '../../lib/pairity'
import { Logger } from '../../lib/logger'
import { Schemas } from '../../lib/schemas'
import { Errors } from '../../lib/errors'

Meteor.methods({
    unInviteOrganizationMember: function (memberId) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        const member = OrganizationMembers.findOne(memberId)

        if (!member) {
            Errors.throw('not-found', 'Organization Member')
        }

        if (member.status !== Pairity.MemberStatuses.MEMBER_PENDING) {
            Errors.throw('custom', 'User has already accepted invite!')
        }

        try {
            const retVal = OrganizationMembers.remove({
                _id: memberId
            })

            return retVal
        } catch (err) {
            Logger.log('UnInvite org member failed', memberId, err)
            if (err.sanitizedError) {
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Errors.throw('custom', err.reason)
            }
        }
    }
})
