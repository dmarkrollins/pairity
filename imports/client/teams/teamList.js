import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'
import { _ } from 'meteor/underscore'

import { Pairity, Teams } from '../../lib/pairity'

Template.teamList.onCreated(function () {
    const self = this

    self.loaded = new ReactiveVar(0)

    self.autorun(function () {
        const search = Session.get(Pairity.TeamSearchKey) || { limit: 10, name: '' }
        const subscription = self.subscribe('allTeams', search)

        if (subscription.ready()) {
            self.loaded.set(Teams.find().count())
        }
    })

    self.getSearch = () => ({ limit: 10, name: '' })
})

Template.teamList.helpers({
    team() {
        return Teams.find({}, { sort: { name: 1 } })
    },
    hasTeams() {
        return Teams.find({}).count() > 0
    },
    hasMoreTeams() {
        const instance = Template.instance()
        const search = instance.getSearch()
        return instance.loaded.get() === search.limit
    },
    searchVal() {
        const search = Session.get(Pairity.TeamSearchKey)
        if (search) {
            return search.name || ''
        }
    },
    orgManager() {
        return false
    }
})

Template.teamList.events({
    'input #searchBox': _.debounce(function (event, instance) {
        let search = Session.get(Pairity.TeamSearchKey) || { limit: Pairity.defaultLimit, name: '' }
        if (!_.isObject(search)) {
            search = { limit: Pairity.defaultLimit, name: '' }
        }
        search.name = event.target.value
        search.limit = Pairity.defaultLimit
        Session.set(Pairity.TeamSearchKey, search)
    }, 500)
})
