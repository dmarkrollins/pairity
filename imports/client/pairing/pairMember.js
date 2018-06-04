import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity, Teams } from '../../lib/pairity'
import { Toast } from '../common/toast'

Template.pairMember.onCreated(() => {
    const self = this
})

Template.pairMember.helpers({
    isPresent() {
        return this.isPresent
    }
})
