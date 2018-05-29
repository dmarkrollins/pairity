import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Accounts } from 'meteor/accounts-base'
import { Pairity, IsTeamAdmin, Organizations, OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'

Meteor.methods({
    unInviteOrganizationMember: function (memberId) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }

        const member = OrganizationMembers.findOne(memberId)

        if (!member) {
            throw Errors.create('not-found', 'Organization Member')
        }

        if (member.status !== Pairity.MemberStatuses.MEMBER_PENDING) {
            throw Errors.create('custom', 'User has already accepted invite!')
        }

        try {
            const retVal = OrganizationMembers.remove({
                _id: memberId
            })

            return retVal
        } catch (err) {
            Logger.log('UnInvite org member failed', memberId, err)
            if (err.sanitizedError) {
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                throw Errors.create('custom', err.reason)
            }
        }
    }
})
