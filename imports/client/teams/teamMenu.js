import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'

import { Teams } from '../../lib/pairity'

Template.teamMenu.onRendered(function () {
    if (this.data.selectedItem) {
        $(`#${this.data.selectedItem}`).addClass('bolded-link')
    }
})

Template.teamMenu.helpers({
    teamId() {
        const t = Teams.findOne()
        if (t) {
            return t._id
        }
    }
})
