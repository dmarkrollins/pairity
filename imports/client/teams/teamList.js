import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'
import { Pairity, Teams } from '../../lib/pairity'

Template.teamList.onCreated(function () {
    const self = this

    self.loaded = new ReactiveVar(0)

    self.autorun(function () {
        const search = Session.get(Pairity.TeamSearchKey) || { limit: 10, title: '' }
        const subscription = self.subscribe('allTeams', search)

        if (subscription.ready()) {
            self.loaded.set(Teams.find().count())
        }
    })
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
    }
})

Template.teamList.onRendered(function () {
    const self = this
})
