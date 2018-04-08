import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { Pairity, Teams, TeamTech, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    removeTeamTech: function (teamId, techId) {
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

        const tech = TeamTech.findOne(techId)

        if (!tech) {
            throw Errors.create('not-found', 'Technology')
        }

        try {
            const result = TeamTech.remove({
                _id: techId,
                teamId: teamId
            })
            return result.nModified
        } catch (err) {
            if (err.sanitizedError) {
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                Logger.log('TeamRole delete failed', this.userId, err)
                throw Errors.create('delete-failed', 'Technology')
            }
        }
    }
})
