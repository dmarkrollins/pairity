/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { OrganizationMembers } from '../../../imports/lib/pairity'
import { Logger } from '../../../imports/lib/logger'

import { TestData } from '../../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../../imports/server/index'

    describe('Method - Add User to Org', function () {
        let userId
        let sandbox
        let subject

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.addUserToOrg;
        });

        afterEach(function () {
            OrganizationMembers.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, TestData.fakeOrganizationMembers());
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be authenticated to perform this action! [not-logged-in]');
        })

        it('should be a valid document', function () {
            const context = { userId: userId };
            let msg = '';
            const bogusOrganizationUser = { key1: 'key1', key2: 'key2' }
            sandbox.stub(OrganizationMembers, 'insert')

            try {
                const resultId = subject.apply(context, [bogusOrganizationUser]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should bod schema').to.be.equal('Document provided is invalid! [invalid-document]');
        })

        it('checks for dups', function () {
            const context = { userId: userId };
            let msg = '';
            const fakeEntry = { organizationId: Random.id(), userId: userId }
            sandbox.stub(OrganizationMembers, 'findOne').returns(fakeEntry)
            sandbox.stub(OrganizationMembers, 'insert')

            try {
                const resultId = subject.apply(context, [fakeEntry]);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw dup error').to.be.equal('Member has already been added to this organization! [duplicate-found]');
        })

        it('inserts new user in organization correctly - stubbed', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeEntry = { organizationId: newId, userId: userId }
            sandbox.stub(OrganizationMembers, 'findOne').returns(null)
            sandbox.stub(OrganizationMembers, 'insert').returns(newId)

            try {
                resultId = subject.apply(context, [fakeEntry]);
            } catch (error) {
                msg = error.message;
            }

            expect(resultId).to.equal(newId)

            const params = OrganizationMembers.insert.args[0][0]
            expect(params.userId).to.equal(fakeEntry.userId)
            expect(params.organizationId).to.equal(fakeEntry.organizationId)
        })

        it('handles insert error correctly', function () {
            const context = { userId: userId };
            let msg = '';
            const newId = Random.id()
            let resultId = ''
            const fakeEntry = TestData.fakeOrganizationMember()
            sandbox.stub(OrganizationMembers, 'findOne').returns(null)
            sandbox.stub(OrganizationMembers, 'insert').throws(TestData.fakeError())
            sandbox.stub(Logger, 'log')

            try {
                resultId = subject.apply(context, [fakeEntry]);
            } catch (error) {
                msg = error.reason;
            }

            expect(Logger.log).to.have.been.called
            expect(msg).to.equal('User not added to organization - please try again later!')
        })
    })
}
