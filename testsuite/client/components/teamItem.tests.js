/* eslint-env mocha */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, simulate, configure } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai'

import { Pairity, Teams } from '../../../imports/lib/pairity'
import { TestData } from '../../testData'

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme())
chai.use(sinonChai)

if (Meteor.isClient) {
    import '../../../imports/client/components/registerAll'

    describe('Team Item Component', function () {
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
            const wrapper = mount(<Pairity.Components.TeamItem
                handleSave={isSaved}
                handleCancel={isCancelled}
            />)

            expect(wrapper.find('#teamName'), 'team name found').to.have.length(1)
            expect(wrapper.find('#teamDesc'), 'team desc found').to.have.length(1)
            expect(wrapper.find('p.errorMessage'), 'err message found').to.have.length(1)
            expect(wrapper.find('button'), 'should have 2 buttons').to.have.length(2)
        })

        it('displays correctly with team passed in', function () {
            const fakeTeam = TestData.fakeTeam({ name: 'fake team name', description: 'fake team desc' })

            const wrapper = mount(<Pairity.Components.TeamItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                team={fakeTeam}
            />)

            expect(wrapper.find('#teamName').get(0).props.value).to.equal('fake team name')
            expect(wrapper.find('#teamDesc').get(0).props.value).to.equal('fake team desc')
        })

        it('when save is tapped the correct callback is invoked correctly', function () {
            const createdDate = new Date()

            const fakeTeam = TestData.fakeTeam({
                name: 'fake team name',
                description: 'fake team desc',
                _id: 'fake-id',
                createdAt: createdDate,
                createdBy: 'fake-user'
            })

            const wrapper = mount(<Pairity.Components.TeamItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                team={fakeTeam}
            />)

            wrapper.find('button.button-primary').simulate('click')

            expect(isSaved).to.have.been.calledWith({
                _id: 'fake-id',
                createdAt: createdDate,
                createdBy: 'fake-user',
                description: 'fake team desc',
                name: 'fake team name'
            })
        })

        it('when cancel is tapped the correct callback is invoked', function () {
            const fakeTeam = TestData.fakeTeam({ name: 'fake team name', description: 'fake team desc' })

            const wrapper = mount(<Pairity.Components.TeamItem
                handleSave={isSaved}
                handleCancel={isCancelled}
                team={fakeTeam}
            />)

            wrapper.find('button.button-default').simulate('click')

            expect(isCancelled).to.have.been.called
        })
    })
}
