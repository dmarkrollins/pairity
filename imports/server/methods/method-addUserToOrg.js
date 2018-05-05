import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'

Meteor.methods({
    addUserToOrg: (doc) => {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const context = Schemas.OrganizationMembers.newContext()

        // verify user has not already been added to this organization
        const r = OrganizationMembers.findOne({ organizationId: doc.orgId, userId: doc.userId })

        if (r) {
            throw Errors.create('', 'Member has already been added to this organization')
        }

        try {
            OrganizationMembers.insert(
                {
                    organizationId: doc.orgId,
                    userId: doc.userId
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
        } catch (err) {
            if (err.sanitizedError) {
                throw new Meteor.Error('insert-failed', err.sanitizedError.reason)
            } else {
                Logger.log('OrganizationMember insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Member not added to organization - please try again later!')
            }
        }
    }
})
