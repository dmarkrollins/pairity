import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'

import { Pairity, Teams, TeamTech, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'
import { Logger } from '../../../imports/lib/logger'

Meteor.methods({
    addTeamTech: function (teamId, techName) {
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
            if (_.find(t.roles, item => item.name === techName).length > 0) {
                throw Errors.create('duplicate-found', 'Technology')
            }
        } else {
            t.technologies = []
        }

        t.technologies.push(techName)

        try {
            const id = Teams.update(
                {
                    _id: teamId,
                },
                {
                    roles: t.technologies
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
                Logger.log('Technology insert failed', this.userId, err)
                throw Errors.create('insert-failed', 'Technology')
            }
        }
    }
})
