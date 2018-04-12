/* eslint-env mocha */
import React from 'react';
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, simulate, configure } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai'

import { Pairity } from '../../../imports/lib/pairity'

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme())
chai.use(sinonChai)

if (Meteor.isClient) {
    import '../../../imports/client/components/registerAll'

    describe('Team Sub List Item Component', function () {
        let isSelected
        let sandbox
        const id = Random.id()

        before(function () {
            sandbox = sinon.createSandbox()
        })

        before(function () {
            isSelected = sandbox.stub()
        })

        afterEach(function () {
            sandbox.restore()
        })

        it('displays correctly', function () {
            const wrapper = mount(<Pairity.Components.TeamSubListItem
                handleSelected={isSelected}
                label="Fake Item"
                value={id}
                className="fakeClass"
            />)

            expect(wrapper.find('div.fakeClass'), 'list item').to.have.length(1)
            expect(wrapper.find('div.fakeClass').get(0).props.children, 'item value').to.equal('Fake Item')
        })
    })
}
