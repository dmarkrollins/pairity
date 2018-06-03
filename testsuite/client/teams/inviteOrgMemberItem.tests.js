/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Accounts } from 'meteor/accounts-base'
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import StubCollections from 'meteor/hwillson:stub-collections'
import { withRenderedTemplate } from '../../clientTestHelpers';
import { Pairity, Teams, TeamMembers, Organizations } from '../../../imports/lib/pairity'

import { TestData } from '../../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/teams/inviteOrgMemberItem.html'
    import '../../../imports/client/teams/inviteOrgMemberItem.js'

    describe('Invite Org Member Item', function () {
        let userId;
        let sandbox
        let template
        let addMember
        let removeMember
        let isTeamMember

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id();
            Template.registerHelper('_', key => key);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
            addMember = sandbox.stub()
            removeMember = sandbox.stub()
            isTeamMember = sandbox.stub()
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore();
        });


        it('displays team member correctly', function () {
            isTeamMember.returns(true)

            const currentItem = () => ({
                data: {
                    userId: 'fake-user',
                    _id: userId,
                    username: 'fake-user',
                    email: 'fake-email'
                },
                addTeamMember: function (orgMemberId) {
                    addMember(orgMemberId)
                },
                removeTeamMember: function (orgMemberId) {
                    removeMember(orgMemberId)
                },
                isTeamMember: function (userid) {
                    return isTeamMember(userid)
                }
            })

            withRenderedTemplate('inviteOrgMemberItem', currentItem, (el) => {
                expect($(el).find('#btnRemove')).to.have.length(1)
                expect($(el).find('#btnAdd')).to.have.length(0)
                expect($(el).find('div.invite-org-member-item')[0].innerText).to.equal('fake-user - fake-email')

                $(el).find('#btnRemove')[0].click()
                Tracker.flush()

                expect(removeMember).to.have.been.called
                expect(removeMember).to.have.been.calledWith(userId)
            });
        })

        it('displays non team member correctly', function () {
            isTeamMember.returns(false)

            const currentItem = () => ({
                data: {
                    userId: 'fake-user',
                    _id: userId,
                    username: 'fake-user',
                    email: 'fake-email'
                },
                addTeamMember: function (orgMemberId) {
                    addMember(orgMemberId)
                },
                removeTeamMember: function (orgMemberId) {
                    removeMember(orgMemberId)
                },
                isTeamMember: function (userid) {
                    return isTeamMember(userid)
                }
            })

            withRenderedTemplate('inviteOrgMemberItem', currentItem, (el) => {
                expect($(el).find('#btnRemove')).to.have.length(0)
                expect($(el).find('#btnAdd')).to.have.length(1)
                expect($(el).find('div.invite-org-member-item')[0].innerText).to.equal('fake-user - fake-email')

                $(el).find('#btnAdd')[0].click()
                Tracker.flush()

                expect(addMember).to.have.been.called
                expect(addMember).to.have.been.calledWith(userId)
            });
        })
    })
}
