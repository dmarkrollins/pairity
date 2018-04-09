import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { Pairity, Teams, TeamRoles, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    removeTeamRole: function (teamId, roleName) {
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
            if (_.find(t.roles, item => item.name === roleName).length === 0) {
                throw Errors.create('not-found', 'Role')
            }
        } else {
            throw Errors.create('not-found', 'Role')
        }

        t.roles = _.filter(t.roles, item => item.name !== roleName)

        try {
            const result = Teams.update(
                {
                    _id: teamId,
                },
                {
                    roles: t.roles
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
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                Logger.log('TeamRoles delete failed', this.userId, err)
                throw Errors.create('delete-failed', 'Role')
            }
        }
    }
})
