/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { Membership } from '../../../imports/lib/pairity'
import { withRenderedTemplate } from '../../clientTestHelpers';

import TestData from '../../testData.js'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/common/header.html'
    import '../../../imports/client/common/header.js'

    describe('Header Template', function () {
        let userId;
        let sandbox

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            sandbox = sinon.createSandbox()

            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
            sandbox.stub(Template, 'instance').returns({
                isReady: {
                    get: sandbox.stub().returns(true)
                }
            })
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly no search', function () {
            sandbox.stub(Membership, 'findOne').returns(null)
            sandbox.stub(Meteor, 'user').returns(null)

            withRenderedTemplate('header', { title: 'fake-title' }, (el) => {
                expect($(el).find('div#title')[0].innerHTML, 'title').to.equal('fake-title')
                expect($(el).find('div.dropdown-content'), 'drop down').to.have.length(1)
                expect($(el).find('#btnNewTeam'), 'drop down').to.have.length(0)
                expect($(el).find('#btnManageOrg'), 'drop down').to.have.length(0)
                expect($(el).find('#btnPreferences'), 'drop down').to.have.length(1)
                expect($(el).find('#btnLogout'), 'drop down').to.have.length(1)
                expect($(el).find('#searchBox'), 'search box').to.have.length(0)
            });
        })

        it('displays correctly with search', function () {
            withRenderedTemplate('header', { title: 'fake-title', showSearch: 'true', searchPlaceHolder: 'Fake search' }, (el) => {
                expect($(el).find('div#title')[0].innerHTML, 'title').to.equal('fake-title')
                expect($(el).find('#searchBox'), 'search box').to.have.length(1)
                expect($(el).find('#searchBox')[0].placeholder, 'placeholder').to.equal('Fake search')
            });
        })

        it('renders correct as orgmanager', function () {
            sandbox.stub(Membership, 'findOne').returns({ isOrgAdmin: true, organizationId: Random.id() })
            sandbox.stub(Meteor, 'user').returns(null)

            withRenderedTemplate('header', { title: 'fake-title' }, (el) => {
                expect($(el).find('#btnNewTeam'), 'new team').to.have.length(1)
                expect($(el).find('#btnManageSpecificOrg'), 'manage org').to.have.length(1)
                expect($(el).find('#btnNewOrg'), 'manage org').to.have.length(0)
                expect($(el).find('#btnManageOrg'), 'manage org').to.have.length(0)
            });
        })

        it('renders correct as pairity admin', function () {
            sandbox.stub(Membership, 'findOne').returns(null)
            sandbox.stub(Meteor, 'user').returns({ username: 'admin' })

            withRenderedTemplate('header', { title: 'fake-title' }, (el) => {
                expect($(el).find('#btnNewTeam'), 'new team').to.have.length(0)
                expect($(el).find('#btnManageSpecificOrg'), 'manage org').to.have.length(0)
                expect($(el).find('#btnNewOrg'), 'manage org').to.have.length(1)
                expect($(el).find('#btnManageOrg'), 'manage org').to.have.length(1)
            });
        })
    })
}
