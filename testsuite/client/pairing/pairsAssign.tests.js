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
    import '../../../imports/client/pairing/pairsAssign.html'
    import '../../../imports/client/pairing/pairsAssign.js'

    describe('Pairs Assign', function () {
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


        it('displays default view correct', function () {
            const adminids = []

            withRenderedTemplate('pairsAssign', null, (el) => {
                expect($(el).find('#cbEngineering')).to.have.length(1)
                expect($(el).find('#cbProduct')).to.have.length(1)
                expect($(el).find('#cbDesign')).to.have.length(1)
                expect($(el).find('#btnGenerate')).to.have.length(1)
            });
        })
    })
}
