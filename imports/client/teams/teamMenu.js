import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'

Template.teamMenu.onRendered(function () {
    if (this.data.selectedItem) {
        $(`#${this.data.selectedItem}`).addClass('bolded-link')
    }
})
