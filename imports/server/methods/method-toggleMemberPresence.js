import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { Pairity, Teams, IsTeamAdmin, TeamMembers } from '../../../imports/lib/pairity'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    toggleMemberPresence: function (teamMemberId, here) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }

        const tm = TeamMembers.findOne(teamMemberId)

        if (!tm) {
            throw Errors.create('not-found', 'TeamMember')
        }

        const t = Teams.findOne(tm.teamId)

        if (!t) {
            throw Errors.create('not-found', 'Team')
        }

        if (!IsTeamAdmin(t, this.userId)) {
            throw Errors.create('not-admin')
        }

        if (!_.isBoolean(here)) {
            here = true
        }

        try {
            TeamMembers.update(
                {
                    _id: teamMemberId,
                },
                {
                    $set: {
                        isPresent: here
                    }
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
        } catch (err) {
            if (err.sanitizedError) {
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                Logger.log('Toggle Team Member presence failed', this.userId, err)
                throw Errors.create('custom', 'We could not set Team Member presence - try again later!')
            }
        }
    }
})
