import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { Pairity, OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'

Meteor.methods({
    addUserToOrg: function (doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        if (_.isUndefined(doc.status)) {
            doc.status = Pairity.MemberStatuses.MEMBER_PENDING
        }

        if (_.isUndefined(doc.isAdmin)) {
            doc.isAdmin = false
        }

        const context = Schemas.OrganizationMembers.newContext()

        if (!context.validate(doc)) {
            throw new Meteor.Error('invalid-document', 'Document provided is invalid!')
        }

        // verify user has not already been added to this organization
        const r = OrganizationMembers.findOne({ organizationId: doc.organizationId, userId: doc.userId })

        if (r) {
            throw new Meteor.Error('duplicate-found', 'Member has already been added to this organization!')
        }

        try {
            return OrganizationMembers.insert(
                {
                    organizationId: doc.organizationId,
                    userId: doc.userId,
                    status: doc.status,
                    isAdmin: doc.isAdmin
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
                Logger.log('OrganizationMember insert failed', this.userId, err.sanitizedError.reason)
                throw new Meteor.Error('insert-failed', err.sanitizedError.reason)
            } else {
                Logger.log('OrganizationMember insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'User not added to organization - please try again later!')
            }
        }
    }
})
