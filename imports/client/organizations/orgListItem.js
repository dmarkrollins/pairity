import { Template } from 'meteor/templating'
import moment from 'moment'

Template.organizationList.helpers({
    lastModified() {
        const date = this.modifiedAt || this.createdAt
        return moment(date).format('MM/DD/YYYY')
    }
})

