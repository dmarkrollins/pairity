import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'

import { Pairity, Teams, TeamRoles, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    addTeamRole: function (teamId, roleName) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }

        const t = Teams.findOne(teamId)

        if (!t) {
            throw Errors.create('not-found', 'Team')
        }

        if (!IsTeamAdmin(t, this.userId)) {
            throw Errors.create('not-admin')
        }

        if (t.roles) {
            const foundRoles = _.find(t.roles, item => item === roleName)

            if (foundRoles) {
                throw Errors.create('duplicate-found', 'Role')
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
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                Logger.log('TeamRoles insert failed', this.userId, err)
                throw Errors.create('insert-failed', 'Role')
            }
        }
    }
})
