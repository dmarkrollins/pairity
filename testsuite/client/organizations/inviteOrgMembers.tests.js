/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Random } from 'meteor/random'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import StubCollections from 'meteor/hwillson:stub-collections'
import { withRenderedTemplate } from '../../clientTestHelpers'

import { Organizations, OrganizationMembers } from '../../../imports/lib/pairity'

import { TestData } from '../../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/organizations/inviteOrgMembers.html'
    import '../../../imports/client//organizations/inviteOrgMembers.js'
    import '../../../imports/client/organizations/organizationMenu.html'
    import '../../../imports/client/organizations/organizationMenu.js'
    import '../../../imports/client/common/inviteItem.html'
    import '../../../imports/client/common/inviteItem.js'

    describe('Invite Org Members Dialog', function () {
        let userId;
        let sandbox

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            StubCollections.stub([OrganizationMembers]);
            sandbox = sinon.createSandbox()
            sandbox.stub(FlowRouter, 'subsReady').returns(true)
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            StubCollections.restore()
            // Meteor.users.remove({})
            sandbox.restore()
        });

        it('displays correctly no invitees', function () {
            withRenderedTemplate('inviteOrgMembers', null, (el) => {
                expect($(el).find('#inviteForm'), 'invite form').to.have.length(1)
                expect($(el).find('input#textInvite'), 'invite input').to.have.length(1)
                expect($(el).find('#orgAdmin'), 'admin cb').to.have.length(1)
                expect($(el).find('div.invite-item'), 'no items').to.have.length(0)
                expect($(el).find('div.empty-list'), 'should say no items').to.have.length(1)
                expect($(el).find('#btnSubmit'), 'submit button').to.have.length(1)
                expect($(el).find('#errorMessage'), 'err message div').to.have.length(1)
            });
        })

        it('displays correctly with invitees', function () {
            const orgId = Organizations.insert(TestData.fakeOrganization())

            const uid1 = Meteor.users.insert({ username: 'fakeuser1', emails: [{ address: 'fakeuser1@fake.com' }] })
            OrganizationMembers.insert(TestData.fakeOrganizationMember({ organizationId: orgId, userId: uid1 }))
            const uid2 = Meteor.users.insert({ username: 'fakeuser2', emails: [{ address: 'fakeuser2@fake.com' }] })
            OrganizationMembers.insert(TestData.fakeOrganizationMember({ organizationId: orgId, userId: uid2 }))
            const uid3 = Meteor.users.insert({ username: 'fakeuser3', emails: [{ address: 'fakeuser3@fake.com' }] })
            OrganizationMembers.insert(TestData.fakeOrganizationMember({ organizationId: orgId, userId: uid3 }))

            withRenderedTemplate('inviteOrgMembers', null, (el) => {
                expect($(el).find('#inviteForm'), 'invite form').to.have.length(1)
                expect($(el).find('input#textInvite'), 'invite input').to.have.length(1)
                expect($(el).find('#orgAdmin'), 'admin cb').to.have.length(1)
                expect($(el).find('div.invite-item'), '3 items').to.have.length(3)
                expect($(el).find('div.empty-list'), 'should say no items').to.have.length(0)
                expect($(el).find('#btnSubmit'), 'submit button').to.have.length(1)
                expect($(el).find('#errorMessage'), 'err message div').to.have.length(1)
            });
        })

        it('requires email address upon invite', function () {
            const orgId = Organizations.insert(TestData.fakeOrganization())

            withRenderedTemplate('inviteOrgMembers', null, (el) => {
                $(el).find('#btnSubmit')[0].click()
                Tracker.flush()

                expect($(el).find('div#errorMessage')[0].innerText).to.equal('Email address required!')
            });
        })

        it('calls inviteOrganizationMember and handles error correctly - non admin', function () {
            sandbox.stub(Meteor, 'call').yields({ reason: 'fake-error' })
            const fakeOrg = TestData.fakeOrganization()
            const orgId = Organizations.insert(fakeOrg)
            fakeOrg._id = orgId
            sandbox.stub(Organizations, 'findOne').returns(fakeOrg)

            withRenderedTemplate('inviteOrgMembers', null, (el) => {
                $(el).find('#textInvite').val('fakeemail@fake.com')
                Tracker.flush()

                $(el).find('#btnSubmit')[0].click()
                Tracker.flush()

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('inviteOrganizationMember', orgId, 'fakeemail@fake.com', false)
                expect($(el).find('div#errorMessage')[0].innerText).to.equal('fake-error')
            });
        })

        it('calls inviteOrganizationMember and handles error correctly - admin', function () {
            sandbox.stub(Meteor, 'call').yields({ reason: 'fake-error' })
            const fakeOrg = TestData.fakeOrganization()
            const orgId = Organizations.insert(fakeOrg)
            fakeOrg._id = orgId
            sandbox.stub(Organizations, 'findOne').returns(fakeOrg)

            withRenderedTemplate('inviteOrgMembers', null, (el) => {
                $(el).find('#textInvite').val('fakeemail@fake.com')
                $(el).find('#orgAdmin').prop('checked', true);
                Tracker.flush()

                $(el).find('#btnSubmit')[0].click()
                Tracker.flush()

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('inviteOrganizationMember', orgId, 'fakeemail@fake.com', true)
                expect($(el).find('div#errorMessage')[0].innerText).to.equal('fake-error')
            });
        })
    })
}
