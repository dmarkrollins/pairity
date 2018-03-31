/* global moment */

import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'

const faker = Meteor.isTest && require('faker') // eslint-disable-line global-require

const TestData = {}

TestData.fakeTeam = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const team = {}

    team.name = parms.name || faker.company.name
    team.description = parms.description || faker.lorem.sentences(3)

    return team
}

module.exports = { TestData }
