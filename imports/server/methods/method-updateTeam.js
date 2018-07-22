import { Meteor } from 'meteor/meteor'
import { Teams, IsTeamAdmin } from '../../lib/pairity'
import { Logger } from '../../lib/logger'
import { Schemas } from '../../lib/schemas'
import { Errors } from '../../lib/errors'

Meteor.methods({
    updateTeam: function (doc) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        const context = Schemas.Teams.newContext()

        if (!context.validate(doc)) {
            Errors.throw('invalid-format', 'Team')
        }

        const t = Teams.findOne(doc._id)

        if (!t) {
            Errors.throw('not-found', 'Team')
        }

        if (!IsTeamAdmin(t, this.userId)) {
            Errors.throw('not-admin')
        }

        try {
            const retVal = Teams.update(
                {
                    _id: doc._id
                },
                {
                    $set: {
                        name: doc.name,
                        description: doc.description
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
            return retVal.nModified
        } catch (err) {
            Logger.log('Team update failed', this.userId, err)
            if (err.sanitizedError) {
                Errors.throw('custom', err.sanitizedError.reason)
            } else {
                Errors.throw('update-failed', 'Team')
            }
        }
    }
})
