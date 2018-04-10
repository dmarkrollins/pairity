import { Template } from 'meteor/templating'
import moment from 'moment'

Template.teamListItem.helpers({
    modifiedDate() {
        return moment(this.modifiedAt).format('MM/DD/YYYY')
    }
})
