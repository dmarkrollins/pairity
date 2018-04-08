import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Session } from 'meteor/session'
import { Schemas } from './schemas'
import { Errors } from './errors'

const Pairity = {
    defaultConfirmMsg: 'Are you sure?',
    defaultLimit: 10,
    PageTitleKey: 'page-title',
    ToastTimeOut: 1750,
    Components: {}
}

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments; //eslint-disable-line
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match;
        });
    };
}

const Teams = new Mongo.Collection('teams')
const TeamTech = new Mongo.Collection('team-tech')
const TeamRoles = new Mongo.Collection('team-roles')

Teams.attachSchema(Schemas.Teams)
TeamTech.attachSchema(Schemas.TeamTech)
TeamRoles.attachSchema(Schemas.TeamRoles)

const IsTeamAdmin = (team, id) => team.createdBy === id

const RegisterComponent = (name, component) => {
    Pairity.Components[name] = component
}

module.exports = {
    Pairity, Teams, RegisterComponent, IsTeamAdmin, TeamTech, TeamRoles
}
