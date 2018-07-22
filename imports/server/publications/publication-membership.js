import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

import { Pairity, Organizations, OrganizationMembers } from '../../lib/pairity'

Meteor.publish('myMembership', function () {
    if (!Meteor.userId()) {
        return null
    }

    const self = this;

    const orgMember = OrganizationMembers.findOne({ userId: this.userId })

    if (!orgMember) {
        return null
    }

    const handle = Organizations.find({ _id: orgMember.organizationId }).observeChanges({
        added: function (id, fields) {
            const membership = {}
            membership.organizationId = id
            membership.orgName = fields.name
            membership.isOrgAdmin = orgMember.isAdmin
            self.added('membership', id, membership)
        }
    });

    self.ready();

    self.onStop(function () {
        handle.stop()
    });
})
