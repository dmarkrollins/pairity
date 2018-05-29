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
import { PairityModal } from '../../../imports/client/common/pairityModal'

import { TestData } from '../../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/organizations/organizationMenu.html'
    import '../../../imports/client/organizations/organizationMenu.js'

    describe('Organization Menu', function () {
        let userId;
        let sandbox

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('manage menu displays correctly - non admin', function () {
            const info = {
                highlight: 'menuManage'
            }
            withRenderedTemplate('organizationMenu', info, (el) => {
                expect($(el).find('#menuManage'), 'invite form').to.have.length(1)
                expect($(el).find('#menuMembers'), 'invite input').to.have.length(1)
                expect($(el).find('#menuInvite'), 'invite').to.have.length(1)
                expect($(el).find('#menuRemove'), 'remove').to.have.length(0)
                expect($(el).find('#menuReturn'), 'return').to.have.length(0)
            });
        })

        it('manage menu displays correctly - admin', function () {
            sandbox.stub(Meteor, 'user').returns({ username: 'admin' })
            const info = {
                highlight: 'menuManage'
            }
            withRenderedTemplate('organizationMenu', info, (el) => {
                expect($(el).find('#menuManage'), 'invite form').to.have.length(1)
                expect($(el).find('#menuMembers'), 'invite input').to.have.length(1)
                expect($(el).find('#menuInvite'), 'invite').to.have.length(1)
                expect($(el).find('#menuRemove'), 'remove').to.have.length(1)
                expect($(el).find('#menuReturn'), 'return').to.have.length(1)
            });
        })

        it('menu highlights correctly', function () {
            const info = {
                highlight: 'menuManage'
            }

            withRenderedTemplate('organizationMenu', info, (el) => {
                expect($(el).find('#menuManage'), 'invite form').to.have.length(1)
                expect($(el).find('#menuMembers'), 'invite input').to.have.length(1)
                expect($(el).find('#menuInvite'), 'invite').to.have.length(1)
                expect($(el).find('#menuManage.bolded-link'), 'manage should be bolded').to.have.length(1)
            });
        })

        it('manage navigates correctly', function () {
            const info = {
                highlight: 'menuManage'
            }
            sandbox.stub(FlowRouter, 'go')
            const fakeOrg = TestData.fakeOrganization()
            sandbox.stub(Organizations, 'findOne').returns(fakeOrg)
            withRenderedTemplate('organizationMenu', info, (el) => {
                $(el).find('#menuManage')[0].click()
                Tracker.flush()
                expect(FlowRouter.go).to.have.been.called
                expect(FlowRouter.go).to.have.been.calledWith(`/organizations/edit/${fakeOrg._id}`)
            });
        })

        it('invite navigates correctly', function () {
            const info = {
                highlight: 'menuManage'
            }
            sandbox.stub(FlowRouter, 'go')
            const fakeOrg = TestData.fakeOrganization()
            sandbox.stub(Organizations, 'findOne').returns(fakeOrg)
            withRenderedTemplate('organizationMenu', info, (el) => {
                $(el).find('#menuInvite')[0].click()
                Tracker.flush()
                expect(FlowRouter.go).to.have.been.called
                expect(FlowRouter.go).to.have.been.calledWith(`/organizations/invite/${fakeOrg._id}`)
            });
        })

        it('remove prompts correctly', function () {
            sandbox.stub(Meteor, 'user').returns({ username: 'admin' })
            const info = {
                highlight: 'menuManage'
            }
            sandbox.stub(FlowRouter, 'go')
            const fakeOrg = TestData.fakeOrganization()
            sandbox.stub(Organizations, 'findOne').returns(fakeOrg)
            sandbox.stub(PairityModal, 'show')
            withRenderedTemplate('organizationMenu', info, (el) => {
                $(el).find('#menuRemove')[0].click()
                Tracker.flush()
                expect(PairityModal.show).to.have.been.called

                const title = 'Remove Organization?'
                const body = `Are you sure you want to remove organization "${fakeOrg.name}"?<p>All related user and pairing history will be PERMANENTLY destroyed!</p>`
                const okText = 'Remove'

                expect(PairityModal.show).to.have.been.calledWith(title, body, okText)
            });
        })
    })
}
