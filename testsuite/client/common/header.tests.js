/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../../clientTestHelpers';

import { TestData } from '../../testData.js'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/common/header.html'
    import '../../../imports/client/common/header.js'

    describe('Header Template', function () {
        let userId;
        let sandbox
        let fakeUsers = TestData.fakeUsers()

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            Meteor.user = null
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly no search', function () {
            Meteor.user = function () {
                return fakeUsers["Dave-orgMgrRole"]
              }
            withRenderedTemplate('header', { title: 'fake-title' }, (el) => {
                expect($(el).find('div#title')[0].innerHTML, 'title').to.equal('fake-title')
                expect($(el).find('div.dropdown'), 'drop down').to.have.length(1)
                expect($(el).find('#btnNewTeam'), 'drop down').to.have.length(1)
                expect($(el).find('#btnPreferences'), 'drop down').to.have.length(1)
                expect($(el).find('#btnLogout'), 'drop down').to.have.length(1)
                expect($(el).find('div.dropdown'), 'drop down').to.have.length(1)
                expect($(el).find('#searchBox'), 'search box').to.have.length(0)
            });
        })

        it('displays correctly with search', function () {

            withRenderedTemplate('header', { title: 'fake-title', showSearch: true }, (el) => {
                expect($(el).find('div#title')[0].innerHTML, 'title').to.equal('fake-title')
                expect($(el).find('#searchBox'), 'search box').to.have.length(1)
            });
        })

        it('displays "New Team" button for org managers', function() {
            Meteor.user = function () {
                return fakeUsers["Don-noRole"]
              }
            withRenderedTemplate('header', { title: 'fake-title' }, (el) => {
                expect($(el).find('#btnNewTeam'), 'drop down').to.have.length(0)
            })
        })
    })
}
