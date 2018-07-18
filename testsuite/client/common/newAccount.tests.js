/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'
import { Tracker } from 'meteor/tracker'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../../clientTestHelpers';
import { Pairity } from '../../../imports/lib/pairity'

import TestData from '../../testData.js'

const should = chai.should();

if (Meteor.isClient) {
    import '../../../imports/client/common/newAccount.html'
    import '../../../imports/client/common/newAccount.js'

    describe('New Account Dialog', function () {
        let userId;
        let sandbox

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            Template.registerHelper('_', key => key);
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly', function () {
            withRenderedTemplate('newAccount', null, (el) => {
                expect($(el).find('#userName'), 'user name').to.have.length(1)
                expect($(el).find('#emailAddress'), 'email').to.have.length(1)
                expect($(el).find('#password'), 'password').to.have.length(1)
                expect($(el).find('#confirmPassword'), 'confirmpw').to.have.length(1)
                expect($(el).find('#btnCancel'), 'cancel btn').to.have.length(1)
                expect($(el).find('#btnSignUp'), 'sign up btn').to.have.length(1)
                expect($(el).find('span.errorMessage'), 'err message').to.have.length(1)
                expect($(el).find('img#logoImage'), 'logo').to.have.length(1)
            });
        })

        it('validates correctly', function () {
            sandbox.stub(Accounts, 'createUser')

            withRenderedTemplate('newAccount', null, (el) => {
                $(el).find('#btnSignUp')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('A user name is required')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#userName').val('testuser')
                Tracker.flush()

                $(el).find('#btnSignUp')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('An email address is required')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#emailAddress').val('fakeemail@hotmail.com')
                Tracker.flush()

                $(el).find('#btnSignUp')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('Passwords required!')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#password').val('fakepw12345')
                $(el).find('#confirmPassword').val('fakepw12345')
                Tracker.flush()

                $(el).find('#btnSignUp')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('Invalid password - must be >= 8 chars and contain a mix up upper and lower case letters plus at least 1 number :)')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#password').val('Fakepw12345')
                $(el).find('#confirmPassword').val('Fakepw12346')
                Tracker.flush()

                $(el).find('#btnSignUp')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message set correctly').to.equal('Passwords do not match!')
                expect(Accounts.createUser).to.not.have.been.called

                $(el).find('#password').val('Fakepw12345')
                $(el).find('#confirmPassword').val('Fakepw12345')
                Tracker.flush()
            });
        })

        it('calls create account when it has the info it needs', function () {
            sandbox.stub(Accounts, 'createUser')

            const options = {
                username: 'testuser',
                email: 'test@gmail.com',
                password: 'Fakepw12345'
            }

            withRenderedTemplate('newAccount', null, (el) => {
                $(el).find('#userName').val('testuser')
                $(el).find('#emailAddress').val('test@gmail.com')
                $(el).find('#password').val('Fakepw12345')
                $(el).find('#confirmPassword').val('Fakepw12345')
                // $(el).find('#agreeToTerms').prop('checked', true);

                Tracker.flush()

                $(el).find('#btnSignUp')[0].click()
                Tracker.flush()

                expect($(el).find('#errorMessage')[0].innerText, 'error message is not set').to.equal('')
                expect(Accounts.createUser).to.have.been.called

                const parms = Accounts.createUser.args[0]
                expect(parms[0]).to.deep.equal(options)
            });
        })
    })
}
