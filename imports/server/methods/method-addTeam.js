import { Meteor } from 'meteor/meteor'
import { Teams, TeamMembers, OrganizationMembers } from '../../lib/pairity'
import { Logger } from '../../lib/logger'
import { Schemas } from '../../lib/schemas'

Meteor.methods({
    addTeam: function (doc, teamAdmin) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const context = Schemas.Teams.newContext()

        const membership = OrganizationMembers.findOne({ userId: this.userId })

        doc.organizationId = membership.organizationId

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
                    description: doc.description,
                    organizationId: doc.organizationId
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

            Meteor.call('teamMemberAdd', {
                organizationId: doc.organizationId,
                teamId: id,
                userId: teamAdmin,
                isAdmin: true,
                isPresent: true
            }, function (err, response) {
                if (err) {
                    throw new Meteor.Error('insert-failed', err.sanitizedError.reason)
                } else {
                    Logger.log('Team insert failed', this.userId, err)
                    throw new Meteor.Error('insert-failed', 'Team not created - please try again later!')
                }
            })
            return id
        } catch (err) {
            if (err.sanitizedError) {
                throw new Meteor.Error('insert-failed', err.sanitizedError.reason)
            } else {
                Logger.log('Team insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Team not created - please try again later!')
            }
        }
    }
})
