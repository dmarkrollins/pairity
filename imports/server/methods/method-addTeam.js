import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Teams } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'

Meteor.methods({
    addTeam: function (doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const context = Schemas.Teams.newContext()

        if (!context.validate(doc)) {
            throw new Meteor.Error('invalid-document', 'Document provided is invalid!')
        }

        const t = Teams.findOne({ name: doc.name })

        if (t) {
            throw new Meteor.Error('duplicate-found', 'Team name not available!')
        }

        try {
            const id = Teams.insert(
                {
                    name: doc.name,
                    description: doc.description
                },
                {
                    extendAutoValueContext:
                    {
                        isInsert: true,
                        isUpdate: false,
                        isUpsert: false,
                        isFromTrustedCode: true,
                        userId: this.userId
                    }
                }
            )
            return id
        } catch (err) {
            if (err.sanitizedError) {
                throw new Meteor.Error('insert-failed', err.sanitizedError.reason)
            } else {
                Logger.log('Author insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Team not created - please try again later!')
            }
        }
    }
})
