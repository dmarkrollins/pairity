import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { Pairity, OrganizationMembers, Teams, TeamMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../lib/errors'
import { isSuperAdmin } from '../utils/utilities'

Meteor.methods({
    teamMemberAdd: function (tid, orgMemberId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be authenticated to perform this action!')
        }

        const team = Teams.findOne({ _id: tid })

        if (!team) {
            throw Errors.create('not-found', 'Team')
        }

        const contextOrgMember = OrganizationMembers.findOne({ userId: this.userId })

        if (!contextOrgMember) {
            throw Errors.create('custom', 'You must be a member of the organization you are attempting to alter.')
        }

        const userOrgMember = OrganizationMembers.findOne(orgMemberId)

        if (!userOrgMember) {
            throw Errors.create('not-found', 'Organization Member')
        }

        if (userOrgMember.organizationId !== team.organizationId) {
            throw Errors.create('custom', 'You must be a member of the organization that this team belongs to.')
        }

        if (contextOrgMember.isAdmin !== true && !isSuperAdmin(this.userId)) {
            const teamMember = TeamMembers.findOne({ teamId: tid, userId: this.userId })

            let err = false

            if (!teamMember) {
                err = true
            } else if (!teamMember.isAdmin) {
                err = true
            }

            if (err === true) {
                throw Errors.create('custom', 'You must be an admin team member to perform this action.')
            }
        }

        const orgUserTeamMember = TeamMembers.findOne({ teamId: tid, userId: userOrgMember.userId })

        if (orgUserTeamMember) {
            throw Errors.create('custom', 'User is already a member of the team')
        }

        try {
            TeamMembers.insert(
                {
                    organizationId: userOrgMember.organizationId,
                    userId: userOrgMember.userId,
                    teamId: tid,
                    isAdmin: false,
                    isPresent: true
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
            return userOrgMember.username
        } catch (err) {
            if (err.sanitizedError) {
                Logger.log('TeamMember insert failed', this.userId, err.sanitizedError.reason)
            } else {
                Logger.log('TeamMember insert failed', this.userId, err)
            }
            throw Errors.create('insert-failed', 'TeamMember')
        }
    }
})
