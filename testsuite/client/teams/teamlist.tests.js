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
    import '../../../imports/client/teams/teamList.html'
    import '../../../imports/client/teams/teamList.js'
    import '../../../imports/client/teams/teamListItem.html'
    import '../../../imports/client/teams/teamListItem.js'
    import '../../../imports/client/teams/teamSubItems.html'
    import '../../../imports/client/common/helpers.js'

    describe('Team List', function () {
        let userId;
        let sandbox
        let uid
        let template

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            uid = Random.id();
            Template.registerHelper('_', key => key);
            StubCollections.stub([Teams]);
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


        it('displays the teams returned to it', function () {
            const adminids = []
            adminids.push(Random.id())

            // create an org
            const org = TestData.fakeOrganization({ admins: adminids })
            const orgid = Organizations.insert(org)

            for (let i = 0; i < 5; i += 1) {
                Teams.insert(TestData.fakeTeam({ organizationId: orgid, name: `test team ${i}` }))
            }

            withRenderedTemplate('teamList', null, (el) => {
                expect($(el).find('div.team-list-item')).to.have.length(5)
                expect($(el).find('div.team-name')[0].innerText).to.contain('test team 0')
            });
        })
    })
}
