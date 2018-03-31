import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Pairity } from '../../lib/pairity'


Template.newTeam.onCreated(function () {
    const self = this

    self.CreateTeam = (team) => {
        console.log(team)
    }
})

Template.newTeam.helpers({
    saveHandler() {
        const instance = Template.instance();
        return function (team) {
            instance.CreateTeam(team)
        }
    },
    cancelHandler() {
        return function () {
            FlowRouter.go('/teams')
        }
    },
    teamItem() {
        return Pairity.Components.TeamItem
    }
})
