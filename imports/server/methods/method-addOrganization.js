import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { Organizations } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'

Meteor.methods({
    addOrganization: function (doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const context = Schemas.Organizations.newContext()

        if (!context.validate(doc)) {
            throw new Meteor.Error('invalid-document', 'Document provided is invalid!')
        }

        const t = Organizations.findOne({ name: doc.name })

        if (t) {
            throw new Meteor.Error('duplicate-found', 'Organization name not available!')
        }

        try {
            const id = Organizations.insert(
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
                Logger.log('Organization insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Organization not created - please try again later!')
            }
        }
    }
})
