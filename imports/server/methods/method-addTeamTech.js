import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

import { Teams, TeamMembers } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'

Meteor.methods({
    addTeamTech: function (teamId, techName) {
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
            if (foundTech) {
                Errors.throw('duplicate-found', 'Technology')
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
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('Technology insert failed', this.userId, err)
                Errors.throw('insert-failed', 'Technology')
            }
        }
    }
})
