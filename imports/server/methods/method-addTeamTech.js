import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

import { Teams, IsTeamAdmin } from '../../../imports/lib/pairity'
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
            const foundTech = _.find(t.technologies, item => item === techName)
            if (foundTech) {
                throw Errors.create('duplicate-found', 'Technology')
            }
        } else {
            t.technologies = []
        }

        t.technologies.push(techName)

        try {
            const result = Teams.update(
                {
                    _id: teamId,
                },
                {
                    $set: {
                        technologies: t.technologies
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
            return result
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
