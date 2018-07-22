import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'

import { Teams, TeamMembers } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'

Meteor.methods({
    removeTeamTech: function (teamId, techName) {
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

        if (t.technologies) {
            const foundTech = _.find(t.technologies, item => item === techName)
            if (!foundTech) {
                Errors.throw('not-found', 'Technology')
            }
        } else {
            Errors.throw('not-found', 'Technology')
        }

        t.technologies = _.filter(t.technologies, item => item !== techName)

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
            return result.nModified
        } catch (err) {
            if (err.sanitizedError) {
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('Technology delete failed', this.userId, err)
                Errors.throw('delete-failed', 'Technology')
            }
        }
    }
})
