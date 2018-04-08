import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { Pairity, Teams, TeamRoles, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    removeTeamRole: function (teamId, roleId) {
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

        const role = TeamRoles.findOne(roleId)

        if (!role) {
            throw Errors.create('not-found', 'Role')
        }

        try {
            const result = TeamRoles.remove({
                _id: roleId,
                teamId: teamId
            })
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
