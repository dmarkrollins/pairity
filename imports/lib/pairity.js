import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Schemas } from './schemas'
import { Errors } from './errors'

const Pairity = {
    defaultConfirmMsg: 'Are you sure?',
    defaultLimit: 10,
    PageTitleKey: 'page-title',
    TeamSearchKey: 'team-search',
    UserPreferences: 'user-preferences',
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

const Organizations = new Mongo.Collection('organizations')
const OrganizationMembers = new Mongo.Collection('organizationMembers')
const Teams = new Mongo.Collection('teams')
const TeamMembers = new Mongo.Collection('teamMembers')
const Membership = new Mongo.Collection('membership')
const UserPreferences = new Meteor.Collection(Pairity.UserPreferences)

Teams.attachSchema(Schemas.Teams)
TeamMembers.attachSchema(Schemas.TeamMembers)
Organizations.attachSchema(Schemas.Organizations)
OrganizationMembers.attachSchema(Schemas.OrganizationMembers)
Membership.attachSchema(Schemas.Membership)

const IsTeamAdmin = (team, id) => team.createdBy === id

const RegisterComponent = (name, component) => {
    Pairity.Components[name] = component
}

module.exports = {
    Pairity,
    Organizations,
    OrganizationMembers,
    Teams,
    TeamMembers,
    UserPreferences,
    RegisterComponent,
    IsTeamAdmin,
    Membership
}
