import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, Teams } from '../../lib/pairity'

Template.pairsAssign.onCreated(() => {
    const self = this
})

Template.pairsAssign.helpers({
    teamName() {
        const t = Teams.findOne()
        if (t) {
            return t.name
        }
    }
})
