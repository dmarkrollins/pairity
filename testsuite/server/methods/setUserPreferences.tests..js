/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import moment from 'moment'
import { Teams, TeamRoles, IsTeamAdmin } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'
import { Errors } from '../../../imports/lib/errors'

import { TestData } from '../../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Set User Preferences Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.setUserPreferences;
        });

        afterEach(function () {
            // TeamRoles.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, ['fake-role']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not logged in').to.equal('You must be logged in to perform this action!');
        })

        it('calls user update correctly', function () {
            const context = { userId: Random.id() }
            let msg = ''
            const UserFunction = Meteor.users

            sandbox.stub(UserFunction, 'update')

            try {
                const resultId = subject.apply(context, ['fake-role']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'no error').to.be.equal('');
            expect(UserFunction.update).to.have.been.called

            const expected = {
                $set: {
                    userPreferences: 'fake'
                }
            }

            const params = UserFunction.update.args[0]

            expect(params[1].$set.userPreferences.primaryRole).to.deep.equal('fake-role')
        })
    })
}
