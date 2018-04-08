/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { Pairity, IsTeamAdmin } from '../../imports/lib/pairity'
import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isServer) {
    describe('Team Roles', function () {
        it('should determine user is admin if user is team creator', () => {
            const id = Random.id()
            const fakeTeam = TestData.fakeTeam({ createdBy: id })

            expect(IsTeamAdmin(fakeTeam, id)).to.be.true
        })
    })
}
