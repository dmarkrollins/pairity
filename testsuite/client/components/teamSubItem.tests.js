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

    describe('Team Sub Item Component', function () {
        let isSaved
        let isRemoved
        let sandbox

        before(function () {
            sandbox = sinon.createSandbox()
        })

        before(function () {
            isSaved = sandbox.stub()
            isRemoved = sandbox.stub()
        })

        afterEach(function () {
            sandbox.restore()
        })

        it('displays correctly with no items passed in', function () {
            const wrapper = mount(<Pairity.Components.TeamSubItem
                handleSave={isSaved}
                handleRemove={isRemoved}
                list={[]}
                label="Fake Stuff"
            />)

            expect(wrapper.find('div.pure-u-1 label'), 'label found').to.have.length(1)
            expect(wrapper.find('div.pure-u-1 label').get(0).props.children, 'label value correct').to.equal('Fake Stuff')
            expect(wrapper.find('div.pure-u-1 a'), '2 buttons').to.have.length(2)
            expect(wrapper.find('div.pure-u-1 a#btnAdd'), 'add button found').to.have.length(1)
            expect(wrapper.find('div.pure-u-1 a#btnRemove'), 'remove button found').to.have.length(1)
            expect(wrapper.find('div.pure-u-1 select#itemList'), 'list box').to.have.length(1)
            expect(wrapper.find('div.pure-u-1 select#itemList li'), 'no sub items').to.have.length(0)
        })

        it('displays correctly with 3 items passed in', function () {
            const subItems = TestData.fakeSubItems()

            const wrapper = mount(<Pairity.Components.TeamSubItem
                handleSave={isSaved}
                handleRemove={isRemoved}
                list={subItems}
                label="Fake Stuff"
            />)

            expect(wrapper.find('div.pure-u-1 select#itemList li'), 'should have sub items').to.have.length(3)
        })

        it('calls handle single remove with correct information', function () {
            const subItems = TestData.fakeSubItems()

            const wrapper = mount(<Pairity.Components.TeamSubItem
                handleAdd={isSaved}
                handleRemove={isRemoved}
                list={subItems}
                label="Fake Stuff"
            />)

            wrapper.find('div.pure-u-1 select#itemList li').first().simulate('click')

            wrapper.find('div.pure-u-1 a#btnRemove').simulate('click')

            expect(isRemoved).to.have.been.calledWith(['value0'])
        })

        it('calls handle two removes with correct information', function () {
            const subItems = TestData.fakeSubItems()

            const wrapper = mount(<Pairity.Components.TeamSubItem
                handleAdd={isSaved}
                handleRemove={isRemoved}
                list={subItems}
                label="Fake Stuff"
            />)

            wrapper.find('div.pure-u-1 select#itemList li').first().simulate('click')
            wrapper.find('div.pure-u-1 select#itemList li').last().simulate('click')

            wrapper.find('div.pure-u-1 a#btnRemove').simulate('click')

            expect(isRemoved).to.have.been.calledWith(['value0', 'value2'])
        })
    })
}
