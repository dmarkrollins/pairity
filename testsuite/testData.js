/* global moment */
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import { Pairity } from '../imports/lib/pairity'

const TestData = {}

TestData.fakeTeam = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const team = {}

    team._id = parms._id || Random.id()
    team.name = parms.name || 'fake-company-name'
    team.description = parms.description || 'this is a fake sentence'
    team.createdAt = parms.createdAt || new Date()
    team.createdBy = parms.createdBy || Random.id()
    team.organizationId = parms.organizationId || Random.id()

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
    member.isPresent = _.isUndefined(parms.isPresent) ? true : parms.isPresent

    return member
}


TestData.fakeSubItems = (count = 3) => {
    const items = []

    for (let i = 0; i < count; i += 1) {
        items.push({ label: `label${i}`, value: `value${i}` })
    }

    return items
}

TestData.fakeOrganization = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const org = {}

    org._id = parms._id || Random.id()
    org.createdAt = parms.createdAt || new Date()
    if (parms.modifiedAt) {
        org.modifiedAt = parms.modifiedAt
    }
    org.name = parms.name || 'fake-name'
    org.description = parms.description || 'fake paragraph'

    return org
}

TestData.fakeOrganizationMembers = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const retVal = {
        organizationMembers: [],
        users: []
    }

    if (_.isUndefined(parms.count)) {
        parms.count = 3
    }

    for (let i = 0; i < parms.count; i += 1) {
        const memberItem = {
            _id: parms.userId || Random.id(),
            organizationId: parms.organizationId || Random.id(),
            userId: parms.userId || Random.id(),
            status: parms.status || Pairity.MemberStatuses.MEMBER_PENDING,
            isAdmin: !_.isUndefined(parms.isAdmin) ? parms.isAdmin : false,
            username: 'fake-first-name',
            email: 'fake-email@address.com'
        }
        const userItem = {
            _id: memberItem.userId,
            username: `fake-name-${i}`,
            emails: [
                {
                    address: `fakeemail_${i}@fake.com`
                }
            ]
        }
        retVal.organizationMembers.push(memberItem)
        retVal.users.push(userItem)
    }

    return retVal
}

TestData.fakeOrganizationMember = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const doc = {}

    if (parms._id) {
        doc._id = parms._id
    }

    doc.organizationId = parms.organizationId || Random.id()
    doc.userId = parms.userId || Random.id()
    doc.status = parms.status || Pairity.MemberStatuses.MEMBER_PENDING
    doc.isAdmin = !_.isUndefined(parms.isAdmin) ? parms.isAdmin : false
    doc.username = parms.username || 'fake-first-name'
    doc.email = parms.email || 'fake-email@address.com'

    return doc
}

TestData.fakeUser = (parameters) => {
    let parms = {}

    if (!_.isUndefined(parameters)) {
        parms = parameters
    }

    const doc = {}

    doc._id = parms.userId || Random.id()
    doc.username = parms.username || 'fake-name'
    doc.emails = [
        { address: parms.email || 'fake-email@address.com' }
    ]
    doc.userPreferences = {
        primaryRole: parms.primaryRole || Pairity.MemberRoles.ENGINEER
    }

    return doc
}

export { TestData }
