import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'

import { Teams, TeamMembers } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'

Meteor.methods({
    addTeamRole: function (teamId, roleName) {
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
            const foundRoles = _.find(t.roles, item => item === roleName)

            if (foundRoles) {
                Errors.throw('duplicate-found', 'Role')
            }
        } else {
            t.roles = []
        }

        t.roles.push(roleName)

        try {
            const id = Teams.update(
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
            return id
        } catch (err) {
            if (err.sanitizedError) {
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('TeamRoles insert failed', this.userId, err)
                Errors.throw('insert-failed', 'Role')
            }
        }
    }
})
