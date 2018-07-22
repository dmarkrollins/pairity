/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { Pairity } from '../../imports/lib/pairity'

const should = chai.should();

describe('isSuperAdmin', function () {
    let userId;
    let sandbox
    let users
    let subject

    beforeEach(function () {
        sandbox = sinon.createSandbox()
        subject = Meteor.server.method_handlers.isSuperAdmin;
        userId = Random.id()
    })

    afterEach(function () {
        sandbox.restore()
    });

    if (Meteor.isServer) {
        it('should be false if user not found', async function () {
            const context = { userId: null }

            // sandbox.stub(Meteor.users, 'findOne').returns({ username: 'admin' })

            let msg
            let result

            try {
                result = subject.apply(context);
            } catch (error) {
                msg = error.message;
            }

            expect(result).to.be.false
        })

        it('should be false if user not admin', async function () {
            const context = { userId }

            sandbox.stub(Meteor.users, 'findOne').returns({ username: 'not-admin' })

            let msg
            let result

            try {
                result = subject.apply(context);
            } catch (error) {
                msg = error.message;
            }

            expect(result).to.be.false
        })

        it('should be true if user is admin', function () {
            const context = { userId }

            sandbox.stub(Meteor.users, 'findOne').returns({ username: 'admin' })

            let msg
            let result

            try {
                result = subject.apply(context);
            } catch (error) {
                msg = error.message;
            }

            expect(result).to.be.true
        })
    }
})
