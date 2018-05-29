import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

Template.inviteItem.helpers({
    invitee() {
        return this.data
    },
    email() {
        const user = Meteor.users.findOne(this.data.userId)
        if (user) {
            return user.emails[0].address
        }
    }
})

Template.inviteItem.events({

    'click #btnRemove': function (event, instance) {
        event.stopPropagation()
        instance.data.unInvite(this.data._id)
    }

})
