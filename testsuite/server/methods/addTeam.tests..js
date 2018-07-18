/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Teams, TeamMembers, OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'

import { TestData } from '../../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Method - Add Team', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.addTeam;
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
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be authenticated to perform this action! [not-logged-in]');
        })

        it('should be a valid document', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeTeam = TestData.fakeTeam()
            const bogusTeam = { key1: 'key1', key2: 'key2' }
            sandbox.stub(Teams, 'insert')
            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMembers().organizationMembers[0])

            try {
                const resultId = subject.apply(context, [bogusTeam]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should bod schema').to.be.equal('Document provided is invalid! [invalid-document]');
        })

        it('checks for dups', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeTeam = TestData.fakeTeam()
            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMembers().organizationMembers[0])
            sandbox.stub(Teams, 'findOne').returns(fakeTeam)
            sandbox.stub(Teams, 'insert')

            try {
                const resultId = subject.apply(context, [fakeTeam], 'fake-team-admin');
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw dup error').to.be.equal('Team name not available! [duplicate-found]');
        })

        it('inserts new team correctly - stubbed', function () {
            const context = { userId };
            const newId = Random.id()
            let resultId = ''
            sandbox.stub(Teams, 'findOne').returns(null)
            sandbox.stub(Teams, 'insert').returns(newId)
            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMembers({ userId: userId }).organizationMembers[0])
            sandbox.stub(Meteor, 'call').yields(userId)
            
            resultId = subject.apply(context, [{
                name: 'fake-team-name',
                description: 'fake team description',
                organizationId: 'fake-org-id'
            }], userId);

            expect(resultId).to.equal(newId)

            expect(Meteor.call).to.have.been.called
            expect(Meteor.call).to.have.been.calledWith('teamMemberAdd', 'testuser')

            // const params = Teams.insert.args[0][0]

            // expect(params.name).to.equal(fakeTeam.name)
            // expect(params.description).to.equal(fakeTeam.description)
            // expect(params.organizationId).to.equal(fakeTeam.organizationId)

            // expect(TeamMembers.insert, 'team members insert').to.have.been.called
            // const memberParams = TeamMembers.insert.args[0][0]

            // expect(memberParams.organizationId).to.equal(fakeTeam.organizationId)
            // expect(memberParams.teamId).to.equal(newId)
            // expect(memberParams.userId).to.equal(userId)
            // expect(memberParams.isAdmin).to.be.true
            // expect(memberParams.isPresent).to.be.true
        })

        it('handles insert error correctly', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeTeam = TestData.fakeTeam()
            sandbox.stub(Teams, 'findOne').returns(null)
            sandbox.stub(Teams, 'insert').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')
            sandbox.stub(OrganizationMembers, 'findOne').returns(TestData.fakeOrganizationMembers().organizationMembers[0])

            try {
                resultId = subject.apply(context, [fakeTeam], 'fake-team-admin');
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('Team not created - please try again later!')
        })
    })
}
