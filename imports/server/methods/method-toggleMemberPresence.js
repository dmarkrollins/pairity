import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Teams, TeamMembers } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'

Meteor.methods({
    toggleMemberPresence: function (teamMemberId, here) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        const tm = TeamMembers.findOne(teamMemberId)

        if (!tm) {
            Errors.throw('not-found', 'TeamMember')
        }

        const t = Teams.findOne(tm.teamId)

        if (!t) {
            Errors.throw('not-found', 'Team')
        }

        let isAdmin = false

        const member = TeamMembers.findOne({ userId: this.userId })

        if (member) {
            isAdmin = member.isAdmin // eslint-disable-line
        } else {
            const user = Meteor.users.findOne(this.userId)
            if (user) {
                isAdmin = (user.username === 'admin')
            }
        }

        if (!isAdmin) {
            Errors.throw('not-admin')
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
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('Toggle Team Member presence failed', this.userId, err)
                Errors.throw('custom', 'We could not set Team Member presence - try again later!')
            }
        }
    }
})
