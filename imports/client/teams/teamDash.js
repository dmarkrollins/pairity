import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Teams } from '../../lib/pairity'

Template.teamDash.onCreated(function () {
    const self = this

    self.selectedTeamId = FlowRouter.getParam('id')
})

Template.teamDash.helpers({
    teamName() {
        const t = Teams.findOne(Template.instance().selectedTeamId)
        if (t) {
            return t.name
        }
    }
})
