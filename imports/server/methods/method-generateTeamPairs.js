import { Meteor } from 'meteor/meteor'
import { createQuery } from 'meteor/cultofcoders:grapher'
import { _ } from 'lodash'

import { PairHistory, Teams, TeamMembers } from '../../lib/pairity'
import { Errors } from '../../lib/errors'
import { Logger } from '../../lib/logger'
import '../../lib/index'

// //////////////////////////////////////////
// does not handle guest or mob scenarios
// /////////////////////////////////////////

const buildPairs = (array1, array2) => {
    const pairs = []
    for (let i = 0; i < array1.length; i += 1) {
        const pairItem = {}
        pairItem.memberOne = array1[i]._id
        if (array2.length > i) {
            pairItem.memberTwo = array2[i]._id
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
        const memberItem = _.find(members, member => member._id === id)
        if (memberItem) {
            if (memberItem.isPresent) {
                newArray.push(memberItem)
            }
        }
    })
    return newArray
}

Meteor.methods({
    generateTeamPairs: function (tid) {
        if (!this.userId) {
            Errors.throw('not-logged-in')
        }

        const team = Teams.findOne(tid)

        if (!team) {
            Errors.throw('not-found', 'Team')
        }

        const members = createQuery({ teamMembersListQuery: { teamId: tid } }).fetch();

        if (members.length === 0) {
            Errors.throw('not-found', 'TeamMembers')
        }

        let isAdmin = false

        const member = TeamMembers.findOne({ userId: this.userId })

        if (member) {
            isAdmin = member.isAdmin // eslint-disable-line
        } else {
            const user = Meteor.users.findOne(this.userId)
            if (user) {
                isAdmin = (user.username === 'admin')
            }
        }

        if (!isAdmin) {
            Errors.throw('not-admin')
        }

        const history = PairHistory.findOne({ teamId: tid }, { sort: { pairedAt: -1 } })

        let pairs = []

        if (history) {
            pairs = history.pairs // eslint-disable-line
        }

        if (pairs.length === 0) {
            // first pair ever

            const presentMembers = _.filter(members, memberItem => memberItem.isPresent === true) // remove not present members

            const splitMembers = _.chunk(presentMembers, 2) // split in half

            pairs = buildPairs(splitMembers[0], splitMembers[1])
        } else {
            const { twitter, facebook } = history.pairs;
            // do round robin with present members
            const arrayOne = _.map(pairs, 'memberOne')
            const arrayTwo = _.map(pairs, 'memberTwo')

            // console.log(arrayOne)
            // console.log(arrayTwo)

            const items = arrayOne.concat(arrayTwo)

            // console.log('concate items', items)
            // console.log('the members', members)

            const cleanedItems = presentMembersOnly(items, members)

            // console.log('cleaned', cleanedItems)

            const splitMembers = _.chunk(cleanedItems, 2)

            if (splitMembers[1].length > 1) {
                const elem = splitMembers[1].shift() // remove first item
                splitMembers[1].push(elem) // tack it on the end
            }

            // console.log('split members---------\n', splitMembers)

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
                Error.throw('custom', err.sanitizedError.reason)
            } else {
                Logger.log('PairHistory insert failed', this.userId, err)
                Errors.throw('insert-failed', 'Pairs')
            }
        }
    }
})
