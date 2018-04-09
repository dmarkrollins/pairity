import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'

import { Pairity, Teams, TeamTech, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    removeTeamTech: function (teamId, techName) {
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

        if (t.technologies) {
            if (_.find(t.technologies, item => item.name === techName).length === 0) {
                throw Errors.create('not-found', 'Technology')
            }
        } else {
            throw Errors.create('not-found', 'Technology')
        }

        t.technologies = _.filter(t.technologies, item => item.name !== techName)

        try {
            const result = Teams.update(
                {
                    _id: teamId,
                },
                {
                    technologies: t.technologies
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
                Logger.log('Technology delete failed', this.userId, err)
                throw Errors.create('delete-failed', 'Technology')
            }
        }
    }
})
