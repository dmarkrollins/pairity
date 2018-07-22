/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Random } from 'meteor/random'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import StubCollections from 'meteor/hwillson:stub-collections'
import { withRenderedTemplate } from '../../clientTestHelpers';
import { Teams, TeamMembers } from '../../../imports/lib/pairity'

import { TestData } from '../../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/pairing/pairsAssign.html'
    import '../../../imports/client/pairing/pairsAssign.js'
    import '../../../imports/client/pairing/pairMember.html'
    import '../../../imports/client/pairing/pairMember.js'

    describe('Pairs Assign', function () {
        let userId;
        let sandbox
        let uid
        let template

        const fakeUser = {
            username: 'fake-user',
            emails: [
                {
                    address: 'fake-email'
                }
            ],
            userPreferences: {
                primaryRole: 'Engineer'
            }
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            uid = Random.id();
            Template.registerHelper('_', key => key);
            StubCollections.stub([Teams, TeamMembers]);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
            sandbox.stub(Meteor, 'call')
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            StubCollections.restore();
            sandbox.restore();
        });


        it('displays default view correctly', function () {
            const id = Random.id()
            sandbox.stub(FlowRouter, 'getParam').returns(id)

            for (let i = 0; i < 5; i += 1) {
                TeamMembers.insert(TestData.fakeTeamMember({ teamId: id, isPresent: true }))
            }

            sandbox.stub(Session, 'get').returns(['Engineer'])
            sandbox.stub(Meteor.users, 'findOne').returns(fakeUser)

            withRenderedTemplate('pairsAssign', null, (el) => {
                expect($(el).find('div.sub-title'), 'sub titles').to.have.length(4)
                expect($(el).find('#cbEngineering'), 'engineer filter cb').to.have.length(1)
                expect($(el).find('#cbProduct'), 'product filter cb').to.have.length(1)
                expect($(el).find('#cbDesign'), 'design filter cb').to.have.length(1)
                expect($(el).find('#btnGenerate'), 'gen button').to.have.length(1)
                expect($(el).find('div.pair-member'), 'should have members').to.have.length(5)
                expect($(el).find('#btnGenerate.pure-button-disabled'), 'disabled gen button').to.have.length(0)
            });
        })

        it('displays default view correctly - no one is present', function () {
            const id = Random.id()
            sandbox.stub(FlowRouter, 'getParam').returns(id)

            for (let i = 0; i < 5; i += 1) {
                TeamMembers.insert(TestData.fakeTeamMember({ teamId: id, isPresent: false }))
            }

            sandbox.stub(Session, 'get').returns(['Engineer'])
            sandbox.stub(Meteor.users, 'findOne').returns(fakeUser)

            withRenderedTemplate('pairsAssign', null, (el) => {
                expect($(el).find('div.pair-member'), 'should have members').to.have.length(5)
                expect($(el).find('#btnGenerate.pure-button-disabled'), 'gen button').to.have.length(2)
            });
        })

        it('displays default view correctly - nobody with role selected', function () {
            const id = Random.id()
            sandbox.stub(FlowRouter, 'getParam').returns(id)

            for (let i = 0; i < 5; i += 1) {
                TeamMembers.insert(TestData.fakeTeamMember({ teamId: id, isPresent: false }))
            }

            sandbox.stub(Session, 'get').returns(['Design'])
            sandbox.stub(Meteor.users, 'findOne').returns(fakeUser)

            withRenderedTemplate('pairsAssign', null, (el) => {
                expect($(el).find('div.pair-member'), 'should have members').to.have.length(5)
                expect($(el).find('#btnGenerate.pure-button-disabled'), 'gen button').to.have.length(2)
            });
        })

        it('calls toggler when present user made not present', function () {
            let firstId
            const tid = Random.id()
            sandbox.stub(FlowRouter, 'getParam').returns(tid)

            for (let i = 0; i < 5; i += 1) {
                const id = TeamMembers.insert(TestData.fakeTeamMember({ teamId: tid, isPresent: true }))
                if (i === 0) {
                    firstId = id
                }
            }

            sandbox.stub(Session, 'get').returns(['Design'])
            sandbox.stub(Meteor.users, 'findOne').returns(fakeUser)

            withRenderedTemplate('pairsAssign', null, (el) => {
                $(el).find('div.pair-member')[0].children[0].children[0].children[0].click()

                Tracker.flush()

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('toggleMemberPresence', firstId, false)
            });
        })

        it('calls toggler when not present user made present', function () {
            let firstId
            const tid = Random.id()
            sandbox.stub(FlowRouter, 'getParam').returns(tid)

            for (let i = 0; i < 5; i += 1) {
                const id = TeamMembers.insert(TestData.fakeTeamMember({ teamId: tid, isPresent: false }))
                if (i === 0) {
                    firstId = id
                }
            }

            sandbox.stub(Session, 'get').returns(['Design'])
            sandbox.stub(Meteor.users, 'findOne').returns(fakeUser)

            withRenderedTemplate('pairsAssign', null, (el) => {
                $(el).find('div.pair-member')[0].children[0].children[0].children[0].click()

                Tracker.flush()

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('toggleMemberPresence', firstId, true)
            });
        })
    })
}
