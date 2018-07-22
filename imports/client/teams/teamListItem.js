import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router'
import moment from 'moment'
import { Pairity } from '../../lib/pairity';

Template.teamListItem.helpers({
    modifiedDate() {
        return moment(this.modifiedAt).format('MM/DD/YYYY')
    }
})

Template.teamListItem.events({
    'click #btnViewTeam': function (event, instance) {
        event.preventDefault()
        Session.set(Pairity.SELECTED_TEAM, this._id)
        FlowRouter.go(`/teams/dash/${this._id}`)
    }
})
