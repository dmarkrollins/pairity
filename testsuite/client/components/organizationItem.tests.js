/* eslint-env mocha */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, simulate, configure } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai'

import { Pairity, Organizations } from '../../../imports/lib/pairity'
import { TestData } from '../../testData'

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme())
chai.use(sinonChai)

if (Meteor.isClient) {
    import '../../../imports/client/components/registerAll'

    describe('Organization Item Component', function () {
        let isSaved
        let isCancelled
        let sandbox

        before(function () {
            sandbox = sinon.createSandbox()
        })

        before(function () {
            isSaved = sandbox.stub()
            isCancelled = sandbox.stub()
        })

        afterEach(function () {
            sandbox.restore()
        })

        it('displays correctly with no team passed in', function () {
            const wrapper = mount(<Pairity.Components.OrganizationItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            expect(wrapper.find('#orgName'), 'org name found').to.have.length(1)
            expect(wrapper.find('#orgDesc'), 'org desc found').to.have.length(1)
            expect(wrapper.find('p.errorMessage'), 'err message found').to.have.length(1)
            expect(wrapper.find('button'), 'should have 2 buttons').to.have.length(2)
        })

        it('displays correctly with org passed in', function () {
            const fakeOrg = TestData.fakeOrganization({ name: 'fake org name', description: 'fake org desc' })

            const wrapper = mount(<Pairity.Components.OrganizationItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                org={fakeOrg}
            />)

            expect(wrapper.find('#orgName').get(0).props.value).to.equal('fake org name')
            expect(wrapper.find('#orgDesc').get(0).props.value).to.equal('fake org desc')
        })

        it('when save is tapped the correct callback is invoked correctly', function () {
            const createdDate = new Date()
            const fakeOrgId = Random.id()

            const fakeOrg = TestData.fakeOrganization({
                name: 'fake org name',
                description: 'fake org desc',
                _id: 'fake-id',
                createdAt: createdDate,
                createdBy: 'fake-user'
            })

            const wrapper = mount(<Pairity.Components.OrganizationItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                org={fakeOrg}
            />)

            wrapper.find('button.button-primary').simulate('click')

            expect(isSaved).to.have.been.called
            expect(isSaved).to.have.been.calledWith({
                _id: 'fake-id',
                createdAt: createdDate,
                description: 'fake org desc',
                name: 'fake org name'
            })
        })

        it('when cancel is tapped the correct callback is invoked', function () {
            const fakeOrg = TestData.fakeOrganization({ name: 'fake org name', description: 'fake org desc' })

            const wrapper = mount(<Pairity.Components.OrganizationItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                org={fakeOrg}
            />)

            wrapper.find('button.button-default').simulate('click')

            expect(isCancelled).to.have.been.called
        })
    })
}
