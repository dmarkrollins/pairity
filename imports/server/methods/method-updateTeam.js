import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Teams, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../../imports/lib/errors'

Meteor.methods({
    updateTeam: function (doc) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }

        const context = Schemas.Teams.newContext()

        if (!context.validate(doc)) {
            throw Errors.create('invalid-format', 'Team')
        }

        const t = Teams.findOne(doc._id)

        if (!t) {
            throw Errors.create('not-found', 'Team')
        }

        if (!IsTeamAdmin(t, this.userId)) {
            throw Errors.create('not-admin')
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
                throw Errors.create('custom', err.sanitizedError.reason)
            } else {
                throw Errors.create('update-failed', 'Team')
            }
        }
    }
})
