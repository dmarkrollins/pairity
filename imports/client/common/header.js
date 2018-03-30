import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

Template.header.helpers({
    userName() {
        return Meteor.user().username
    }
})
