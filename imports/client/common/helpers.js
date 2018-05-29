import { Meteor } from 'meteor/meteor'
import { Spacebars } from 'meteor/spacebars'
import { Template } from 'meteor/templating'

Meteor.users.deny({
    // deny all updates to user object from client
    update() { return true; }
})

Template.registerHelper('breaklines', function (text) {
    text = text.replace(/(\r\n|\n|\r)/gm, '<br/>');
    return new Spacebars.SafeString(text);
});

