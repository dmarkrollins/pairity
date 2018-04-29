/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { Errors } from '../../imports/lib/errors'

const should = chai.should();

describe('Errors', function () {
    let userId;
    let sandbox

    beforeEach(function () {
        sandbox = sinon.createSandbox()
    });

    afterEach(function () {
        sandbox.restore()
    });

    it('should throw correct error', function () {
        const error = Errors.create('not-logged-in')
        expect(error.reason).to.equal('You must be logged in to perform this action!')
    })

    it('should throw unknown error when error type not found', function () {
        const error = Errors.create('fake-error')
        expect(error.reason).to.equal('An unknown error occurred!')
    })

    it('should embed special value', function () {
        const error = Errors.create('not-found', 'Fake')
        expect(error.reason).to.equal('Fake not found!')
    })

    it('should handle custom error', function () {
        const error = Errors.create('custom', 'This is a fake message')
        expect(error.reason).to.equal('This is a fake message')
    })

    it('should handle a duplicate user added to an org', () => {
        const error = Errors.create('duplicate-user-in-org', 'FakeOrg')
        expect(error.reason).to.equal('User has already been added to FakeOrg!')
    })
})
