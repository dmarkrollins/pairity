/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Accounts } from 'meteor/accounts-base'
import { Random } from 'meteor/random'
import { Session } from 'meteor/session'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import StubCollections from 'meteor/hwillson:stub-collections'
import { withRenderedTemplate } from '../../clientTestHelpers';
import { Pairity, Teams, TeamMembers, Organizations, OrganizationMembers, Membership } from '../../../imports/lib/pairity'

import { TestData } from '../../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/teams/inviteTeamMembers.html'
    import '../../../imports/client/teams/inviteTeamMembers.js'
    import '../../../imports/client/teams/inviteOrgMemberItem.html'
    import '../../../imports/client/teams/inviteOrgMemberItem.js'

    describe('Invite Team Members', function () {
        let userId;
        let sandbox
        let uid
        let template

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            uid = Random.id();
            Template.registerHelper('_', key => key);
            StubCollections.stub([OrganizationMembers]);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
            sandbox.stub(Session, 'set')
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            StubCollections.restore()
            sandbox.restore();
        });

        it('displays list correctly', function () {
            // add 11 members to choose from

            for (let i = 0; i < 10; i += 1) {
                OrganizationMembers.insert(TestData.fakeOrganizationMember({ status: Pairity.MemberStatuses.MEMBER_ACTIVE }))
            }

            withRenderedTemplate('inviteTeamMembers', null, (el) => {
                expect($(el).find('div.invite-org-team-member')).to.have.length(10)
                expect($(el).find('div.ui-legend')).to.have.length(1)
                expect($(el).find('div.ui-title')[0].innerText).to.contain('Invite Team Members')
                expect($(el).find('#btnMore')).to.have.length(1)
                expect($(el).find('div.empty-list')).to.have.length(0)

                $(el).find('#btnMore').click()
                Tracker.flush()

                expect(Session.set).to.have.been.called
                expect(Session.set).to.have.been.calledWith(Pairity.OrgMemberSearchKey, { name: '', limit: 20 })
            });
        })

        it('displays empty list correctly', function () {
            // add 11 members to choose from

            sandbox.stub(Membership, 'findOne').returns({ orgName: 'fake-org-name' })

            withRenderedTemplate('inviteTeamMembers', null, (el) => {
                expect($(el).find('div.invite-org-team-member')).to.have.length(0)
                expect($(el).find('div.ui-legend'), 'ui-legend').to.have.length(1)
                expect($(el).find('div.ui-title')[0].innerText, 'ui title').to.contain('Invite Team Members')
                expect($(el).find('#btnMore'), 'more button').to.have.length(0)
                expect($(el).find('div.empty-list'), 'has empty list').to.have.length(1)
                expect($(el).find('div.empty-list')[0].innerText, 'empty list text').to.contain('No fake-org-name Members found!')
            });
        })
    })
}
