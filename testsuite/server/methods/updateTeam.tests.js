
/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import moment from 'moment'
import { Teams } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'

import { TestData } from '../../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Update Team Method', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.updateTeam;
        });

        afterEach(function () {
            Teams.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, TestData.fakeTeam());
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged in to perform this action!');
        })

        it('should be a valid document', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeTeam = TestData.fakeTeam()
            const bogusTeam = { key1: 'key1', key2: 'key2' }
            sandbox.stub(Teams, 'insert')

            try {
                const resultId = subject.apply(context, [bogusTeam]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should be valid schema').to.be.equal('The format of the Team document provided is invalid!');
        })

        it('checks that team exists', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeTeam = TestData.fakeTeam()
            sandbox.stub(Teams, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [fakeTeam]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not found').to.be.equal('Team not found!');
        })

        it('updates team correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeTeam = TestData.fakeTeam()
            fakeTeam.createdBy = userId
            sandbox.stub(Teams, 'findOne').returns(fakeTeam)
            sandbox.stub(Teams, 'update').returns({ nModified: 1 })

            try {
                resultId = subject.apply(context, [fakeTeam]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg).to.be.equal('')

            expect(resultId).to.equal(1)

            const params = Teams.update.args[0][1]
            expect(params.$set.name).to.equal(fakeTeam.name)
            expect(params.$set.description).to.equal(fakeTeam.description)
        })

        it('handles update error correctly', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeTeam = TestData.fakeTeam()
            fakeTeam.createdBy = userId
            sandbox.stub(Teams, 'findOne').returns(fakeTeam)
            sandbox.stub(Teams, 'update').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeTeam]);
            } catch (error) {
                msg = error.reason;
            }
            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('Team update failed. Please try again later!')
        })
    })
}
