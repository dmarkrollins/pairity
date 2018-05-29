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

    describe('Method - Remove Team Role', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.removeTeamRole;
        });

        afterEach(function () {
            // TeamRoles.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, ['', '']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged in to perform this action!');
        })

        it('team should exist', function () {
            const context = { userId };
            let msg = '';
            sandbox.stub(Teams, 'findOne').returns(null)

            try {
                const resultId = subject.apply(context, [Random.id(), Random.id()]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not found').to.be.equal('Team not found!');
        })

        it('should be admin', function () {
            const context = { userId };
            let msg = '';
            const fakeTeam = TestData.fakeTeam({ createdBy: Random.id() })
            sandbox.stub(Teams, 'findOne').returns(fakeTeam)

            try {
                const resultId = subject.apply(context, [Random.id(), Random.id()]);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not admin').to.be.equal('You must be the team administrator to perform this action!');
        })

        it('role should exist', function () {
            const context = { userId };
            let msg = '';
            const fakeTeam = TestData.fakeTeam({ createdBy: userId })
            sandbox.stub(Teams, 'findOne').returns(fakeTeam)

            try {
                const resultId = subject.apply(context, [Random.id(), 'fake-Role-name']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not found').to.be.equal('Role not found!');
        })

        it('removes teamRoles stubbed', function () {
            const context = { userId };
            let msg = '';
            const id = Random.id()
            let resultId
            const fakeTeam = TestData.fakeTeam({ createdBy: userId })
            fakeTeam.roles = []
            fakeTeam.roles.push('fake-Role-name')

            sandbox.stub(Teams, 'findOne').returns(fakeTeam)
            sandbox.stub(Teams, 'update').returns({ nModified: 1 })

            try {
                resultId = subject.apply(context, [Random.id(), 'fake-Role-name']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw dup error').to.be.equal('')
            expect(resultId).to.equal(1)
        })

        it('handles remove error correctly', function () {
            const context = { userId };
            let msg = '';
            const id = Random.id()
            let resultId
            const fakeTeam = TestData.fakeTeam({ createdBy: userId })
            fakeTeam.roles = []
            fakeTeam.roles.push('fake-Role-name')
            sandbox.stub(Teams, 'findOne').returns(fakeTeam)
            sandbox.stub(Teams, 'update').throws('fake-error')
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [Random.id(), 'fake-Role-name']);
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg, 'should have correct error').to.equal('Role delete failed. Please try again later!')
        })
    })
}
