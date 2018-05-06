/* global Tournaments TIU Divisions */
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import fs from 'fs'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import { $ } from 'meteor/jquery';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector'
import { TestData } from '../../testData'
import { OrganizationMembers } from '../../../imports/lib/pairity'

const should = chai.should();

if (Meteor.isServer) {
    import '../../../imports/server/publications/publication-organizationMembers'

    describe('Publication - OrganizationMembers', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            OrganizationMembers.remove({})
        });

        it('OrganizationMembers published', function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id())

            const member = TestData.fakeOrganizationMembers()[0]

            OrganizationMembers.insert(member)

            const collector = new PublicationCollector()

            collector.collect('organizationMembers', member.userId, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const { organizationMembers } = collections
                expect(organizationMembers).to.have.length(1)
                done();
            });
        })
    })
}
