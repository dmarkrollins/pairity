import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Session } from 'meteor/session'
import { Schemas } from './schemas'

const Pairity = {
    defaultConfirmMsg: 'Are you sure?',
    defaultLimit: 10,
    PageTitleKey: 'page-title',
    Components: {}
}

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

const Teams = new Mongo.Collection('teams')

Teams.attachSchema(Schemas.Teams)

const RegisterComponent = (name, component) => {
    Pairity.Components[name] = component
}

module.exports = { Pairity, Teams, RegisterComponent }
