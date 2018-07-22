import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { Teams, TeamMembers } from '../../lib/pairity'
import { Schemas } from '../../lib/schemas'
import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'

Meteor.methods({
    removeTeamRole: function (teamId, roleName) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        const t = Teams.findOne(teamId)

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

        if (t.roles) {
            const foundRole = _.find(t.roles, item => item === roleName)
            if (!foundRole) {
                Errors.throw('not-found', 'Role')
            }
        } else {
            Errors.throw('not-found', 'Role')
        }

        t.roles = _.filter(t.roles, item => item !== roleName)

        try {
            const result = Teams.update(
                {
                    _id: teamId,
                },
                {
                    $set: {
                        roles: t.roles
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
            return result.nModified
        } catch (err) {
            if (err.sanitizedError) {
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('TeamRoles delete failed', this.userId, err)
                Errors.throw('delete-failed', 'Role')
            }
        }
    }
})
