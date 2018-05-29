import { Template } from 'meteor/templating'

Template.memberItem.helpers({
    checkType() {
        return 'icon-gray'
    }
})

Template.memberItem.helpers({
    'click #btnRemove': function (event, instance) {
        event.stopPropagation()
        instance.data.removeFromTeam(this.data._id)
    },
    'click #btnAdmin': function (event, instance) {
        event.stopPropagation()
        instance.data.toggleAdmin(this.data._id)
    }
})
