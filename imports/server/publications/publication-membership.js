import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

import { Pairity, Organizations, OrganizationMembers } from '../../../imports/lib/pairity'

Meteor.publish('myMembership', function () {
    if (!this.userId) {
        return null
    }

    const self = this;

    const orgMember = OrganizationMembers.findOne({ userId: this.userId })

    if (!orgMember) {
        if (Meteor.isDevelopment) { console.log('membership - not an org member') }
        return null
    }

    const org = Organizations.findOne({ _id: orgMember.organizationId })

    if (!org) {
        if (Meteor.isDevelopment) { console.log('membership - not part of any org') }
        return null
    }

    const membership = {}
    membership.organizationId = org._id
    membership.orgName = org.name
    membership.isOrgAdmin = orgMember.isAdmin

    console.log('adding membership', membership)
    self.added('myMembership', org._id, membership)

    self.ready();
})
