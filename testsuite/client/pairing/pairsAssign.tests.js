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
import { AmplifiedSession } from '../../../imports/client/common/amplify'

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
            for (let i = 0; i < 5; i += 1) {
                TeamMembers.insert(TestData.fakeTeamMember({ isPresent: true }))
            }

            sandbox.stub(AmplifiedSession, 'get').returns(['Engineer'])
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
            for (let i = 0; i < 5; i += 1) {
                TeamMembers.insert(TestData.fakeTeamMember({ isPresent: false }))
            }

            sandbox.stub(AmplifiedSession, 'get').returns(['Engineer'])
            sandbox.stub(Meteor.users, 'findOne').returns(fakeUser)

            withRenderedTemplate('pairsAssign', null, (el) => {
                expect($(el).find('div.pair-member'), 'should have members').to.have.length(5)
                expect($(el).find('#btnGenerate.pure-button-disabled'), 'gen button').to.have.length(2)
            });
        })

        it('displays default view correctly - nobody with role selected', function () {
            for (let i = 0; i < 5; i += 1) {
                TeamMembers.insert(TestData.fakeTeamMember({ isPresent: false }))
            }

            sandbox.stub(AmplifiedSession, 'get').returns(['Design'])
            sandbox.stub(Meteor.users, 'findOne').returns(fakeUser)

            withRenderedTemplate('pairsAssign', null, (el) => {
                expect($(el).find('div.pair-member'), 'should have members').to.have.length(5)
                expect($(el).find('#btnGenerate.pure-button-disabled'), 'gen button').to.have.length(2)
            });
        })

        it('calls toggler when present user made not present', function () {
            let firstId

            for (let i = 0; i < 5; i += 1) {
                const id = TeamMembers.insert(TestData.fakeTeamMember({ isPresent: true }))
                if (i === 0) {
                    firstId = id
                }
            }

            sandbox.stub(AmplifiedSession, 'get').returns(['Design'])
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

            for (let i = 0; i < 5; i += 1) {
                const id = TeamMembers.insert(TestData.fakeTeamMember({ isPresent: false }))
                if (i === 0) {
                    firstId = id
                }
            }

            sandbox.stub(AmplifiedSession, 'get').returns(['Design'])
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
