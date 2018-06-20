import { Meteor } from 'meteor/meteor'
import { createQuery } from 'meteor/cultofcoders:grapher'
import { _ } from 'lodash'
import { PairHistory, Teams, IsTeamAdmin } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'

// //////////////////////////////////////////
// does not handle guest or mob scenarios
// /////////////////////////////////////////

const buildPairs = (array1, array2) => {
    const pairs = []
    for (let i = 0; i < array1[0].length; i += 1) {
        const pairItem = {}
        pairItem.memberOne = array1[i]
        if (array2.length > i) {
            pairItem.memberTwo = array2[i]
        } else {
            pairItem.memberTwo = null // 1 is solo
        }
        pairs.push(pairItem)
    }
    return pairs
}

const presentMembersOnly = (ids, members) => {
    const newArray = []
    ids.forEach((id) => {
        const memberItem = _.find(members, member => member.userId === id)
        if (memberItem) {
            if (memberItem.isPresent) {
                newArray.push(id)
            }
        }
    })
    return newArray
}

Meteor.methods({
    generatePairs: function (tid) {
        if (!this.userId) {
            throw Errors.create('not-logged-in')
        }
        const team = Teams.findOne(tid)

        if (!team) {
            throw Errors.create('not-found', 'Team')
        }

        const members = createQuery({
            teamMembersList: { teamId: tid },
        }).fetch();

        if (!members) {
            throw Errors.create('not-found', 'TeamMembers')
        }

        if (!IsTeamAdmin(team, this.userId)) {
            throw Errors.create('not-admin')
        }

        const history = PairHistory.findOne({ teamId: tid }, { sort: { pairedAt: -1 } })

        let pairs = []

        if (history) {
            pairs = { history }
        }

        if (pairs === []) {
            // first pair ever
            const presentMembers = _.reject(members, member => !member.isPresent) // remove not present members
            const splitMembers = _.chunk(presentMembers, 2) // split in half

            pairs = buildPairs(splitMembers[0], splitMembers[1])
        } else {
            // do round robin with present members
            const arrayOne = _.map(pairs, 'memberOne')
            const arrayTwo = _.map(pairs, 'memberTwo')

            const items = arrayOne.concat(arrayTwo)

            const cleanedItems = presentMembersOnly(items, members)

            const splitMembers = _.chunk(cleanedItems, 2)

            if (splitMembers[1].length > 1) {
                const elem = splitMembers[1].shift() // remove first item
                splitMembers[1].push(elem) // tack it on the end
            }

            pairs = buildPairs(splitMembers[0], splitMembers[1])
        }

        try {
            const id = PairHistory.insert(
                {
                    userId: this.userId,
                    teamId: tid,
                    pairs
                },
                {
                    extendAutoValueContext:
                        {
                            isInsert: true,
                            isUpdate: false,
                            isUpsert: false,
                            isFromTrustedCode: true,
                            userId: this.userId
                        }
                }
            )

            return PairHistory.findOne(id)
        } catch (err) {
            if (err.sanitizedError) {
                Logger.log('PairHistory insert failed', this.userId, err.sanitizedError.reason)
                throw new Meteor.Error('insert-failed', err.sanitizedError.reason)
            } else {
                Logger.log('PairHistory insert failed', this.userId, err)
                throw new Meteor.Error('insert-failed', 'Pairs could not be generated - please try again later!')
            }
        }
    }
})

module.exports = { presentMembersOnly, buildPairs }
