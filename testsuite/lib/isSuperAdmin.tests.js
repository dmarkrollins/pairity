/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { Pairity } from '../../imports/lib/pairity'

const should = chai.should();

describe('isSuperAdmin', function () {
    let userId;
    let sandbox
    let users

    beforeEach(function () {
        sandbox = sinon.createSandbox()
    })

    afterEach(function () {
        sandbox.restore()
    });

    if (Meteor.isServer) {
        it('should be false if user not found', function () {
            sandbox.stub(Meteor.users, 'findOne').returns(null)

            const retval = Pairity.isSuperAdmin('fake-id')

            expect(retval).to.be.false
        })

        it('should be false if user not admin', function () {
            sandbox.stub(Meteor.users, 'findOne').returns({ username: 'not-admin' })

            const retval = Pairity.isSuperAdmin('fake-id')

            expect(retval).to.be.false
        })

        it('should be true if user is admin', function () {
            sandbox.stub(Meteor.users, 'findOne').returns({ username: 'admin' })

            const retval = Pairity.isSuperAdmin('fake-id')

            expect(retval).to.be.true
        })
    }

    if (Meteor.isClient) {
        it('should be false if user is not set', function () {
            sandbox.stub(Meteor, 'user').returns(null)

            const retval = Pairity.isSuperAdmin('fake-id')

            expect(retval).to.be.false
        })

        it('should be false if user is not admin', function () {
            sandbox.stub(Meteor, 'user').returns({ username: 'not-admin' })

            const retval = Pairity.isSuperAdmin('fake-id')

            expect(retval).to.be.false
        })

        it('should be true if user is admin', function () {
            sandbox.stub(Meteor, 'user').returns({ username: 'admin' })

            const retval = Pairity.isSuperAdmin('fake-id')

            expect(retval).to.be.true
        })
    }
})
