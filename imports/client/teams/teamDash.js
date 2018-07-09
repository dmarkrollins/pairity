import { Template } from 'meteor/templating'
import { Teams } from '../../lib/pairity'

Template.teamDash.helpers({
    teamName() {
        const t = Teams.findOne()
        if (t) {
            return t.name
        }
    }
})
