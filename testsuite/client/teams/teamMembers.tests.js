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
    import '../../../imports/client/teams/teamMembers.html'
    import '../../../imports/client/teams/teamMembers.js'
    import '../../../imports/client/teams/memberItem.html'
    import '../../../imports/client/teams/memberItem.js'
    import '../../../imports/client/teams/teamMenu.html'
    import '../../../imports/client/teams/teamMenu.js'

    describe('Team Members', function () {
        let userId;
        let sandbox
        let uid
        let template

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            uid = Random.id();
            Template.registerHelper('_', key => key);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            StubCollections.restore();
            sandbox.restore();
        });


        it('displays empty list', function () {
            const fakeTeam = TestData.fakeTeam()
            sandbox.stub(Teams, 'findOne').returns(fakeTeam)

            withRenderedTemplate('teamMembers', null, (el) => {
                expect($(el).find('div.pure-u-1 label')[0].innerText).to.equal('Current Members')
                expect($(el).find('div#title')[0].innerText).to.equal(fakeTeam.name)
            });
        })
    })
}
