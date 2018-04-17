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

    team._id = parms._id || Random.id()
    team.name = parms.name || faker.company.companyName()
    team.description = parms.description || faker.lorem.sentences(3)
    team.createdAt = parms.createdAt || new Date()
    team.createdBy = parms.createdBy || Random.id()

    return team
}

TestData.fakeTeamTech = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const teamTech = {}

    teamTech._id = parms._id || Random.id()
    teamTech.teamId = parms.teamId || Random.id()
    teamTech.name = parms.name || 'fake-team-tech'
    return teamTech
}

TestData.fakeTeamRoles = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const teamRole = {}

    teamRole._id = parms._id || Random.id()
    teamRole.teamId = parms.teamId || Random.id()
    teamRole.name = parms.name || 'fake-team-role'
    return teamRole
}

TestData.fakeError = (message) => {
    const err = {}

    err.error = 'error-occurred'
    err.reason = message || 'fake reason'
    err.details = 'fake details'

    return err
}

TestData.fakeTeamMember = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const member = {}

    member._id = Random.id()
    member.organizationId = parms.organizationId || Random.id()
    member.teamId = parms.teamId || Random.id()
    member.userId = parms.userId || Random.id()
    member.isAdmin = _.isUndefined(parms.isAdmin) ? false : parms.isAdmin
    member.isPresent = _.isUndefined(parms.isPresent) ? false : parms.isPresent

    return member
}


TestData.fakeSubItems = (count = 3) => {
    const items = []

    for (let i = 0; i < count; i += 1) {
        items.push({ label: `label${i}`, value: `value${i}` })
    }

    return items
}

module.exports = { TestData }
