import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { Pairity, OrganizationMembers, Teams, TeamMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Schemas } from '../../../imports/lib/schemas'
import { Errors } from '../../lib/errors'

Meteor.methods({
    teamMemberRemove: function (tid, orgMemberId) {
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
            throw Errors.create('custom', 'User must be a member of the organization that this team belongs to.')
        }

        if (contextOrgMember.isAdmin !== true && !Pairity.isSuperAdmin(this.userId)) {
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

        if (!orgUserTeamMember) {
            throw Errors.create('not-found', 'TeamMember')
        }

        try {
            TeamMembers.remove({
                _id: orgUserTeamMember._id
            })
            return userOrgMember.username
        } catch (err) {
            if (err.sanitizedError) {
                Logger.log('TeamMember delete failed', this.userId, err.sanitizedError.reason)
            } else {
                Logger.log('TeamMember delete failed', this.userId, err)
            }
            throw new Meteor.Error('delete-failed', 'TeamMember')
        }
    }
})
