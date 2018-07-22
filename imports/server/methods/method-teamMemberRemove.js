import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { SimpleSchema } from 'simpl-schema'
import { _ } from 'meteor/underscore'
import { Pairity, OrganizationMembers, Teams, TeamMembers } from '../../lib/pairity'
import { Logger } from '../../lib/logger'
import { Schemas } from '../../lib/schemas'
import { Errors } from '../../lib/errors'

Meteor.methods({
    teamMemberRemove: function (tid, orgMemberId) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        const team = Teams.findOne({ _id: tid })

        if (!team) {
            Errors.throw('not-found', 'Team')
        }

        const contextOrgMember = OrganizationMembers.findOne({ userId: this.userId })

        if (!contextOrgMember) {
            Errors.throw('custom', 'You must be a member of the organization you are attempting to alter.')
        }

        const userOrgMember = OrganizationMembers.findOne(orgMemberId)

        if (!userOrgMember) {
            Errors.throw('not-found', 'Organization Member')
        }

        if (userOrgMember.organizationId !== team.organizationId) {
            Errors.throw('custom', 'User must be a member of the organization that this team belongs to.')
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
                Errors.throw('custom', 'You must be an admin team member to perform this action.')
            }
        }

        const orgUserTeamMember = TeamMembers.findOne({ teamId: tid, userId: userOrgMember.userId })

        if (!orgUserTeamMember) {
            Errors.throw('not-found', 'TeamMember')
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
            Errors.throw('delete-failed', 'TeamMember')
        }
    }
})
