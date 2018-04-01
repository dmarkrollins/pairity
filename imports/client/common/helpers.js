import { Spacebars } from 'meteor/spacebars'
import { Template } from 'meteor/templating'

Template.registerHelper('breaklines', function (text) {
    text = text.replace(/(\r\n|\n|\r)/gm, '<br/>');
    return new Spacebars.SafeString(text);
});
