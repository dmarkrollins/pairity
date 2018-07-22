import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Schemas } from './schemas'

const Pairity = {
    defaultConfirmMsg: 'Are you sure?',
    defaultLimit: 10,
    PageTitleKey: 'page-title',
    TeamSearchKey: 'team-search',
    OrgMemberSearchKey: 'org-member-search',
    UserPreferences: 'user-preferences',
    ToastTimeOut: 1750,
    Components: {},
    MemberStatuses: {
        MEMBER_PENDING: 'Pending',
        MEMBER_ACTIVE: 'Active',
        MEMBER_INACTIVE: 'InActive'
    },
    MemberRoles: {
        ENGINEER: 'Engineer',
        PRODUCT: 'Product',
        DESIGN: 'Design'
    },
    AmplifiedKeys: {
        ROLE_FILTER: 'roleFilter'
    },
    MemberStatusArray: ['Pending', 'Active', 'InActive'],
    PasswordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    isSuperAdmin: async () => {
        const response = await new Promise((resolve) => {
            Meteor.call('isSuperAdmin', null, function (err, result) {
                if (err) {
                    resolve(false)
                }
                resolve(result)
            })
        })
        return response
    },
    SELECTED_TEAM: 'selected-team'
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
const Membership = new Mongo.Collection('membership') // custom collection
const PairHistory = new Mongo.Collection('pairhistory')

const UserPreferences = new Meteor.Collection(Pairity.UserPreferences)

Teams.attachSchema(Schemas.Teams)
TeamMembers.attachSchema(Schemas.TeamMembers)
Organizations.attachSchema(Schemas.Organizations)
OrganizationMembers.attachSchema(Schemas.OrganizationMembers)
Membership.attachSchema(Schemas.Membership)
PairHistory.attachSchema(Schemas.PairHistory)


const IsTeamAdmin = async (team, uid) => {
    const response = await new Promise((resolve) => {
        Meteor.call('isTeamAdmin', team._id, uid, function (err, result) {
            if (err) {
                resolve(false)
            }
            resolve(result)
        })
    })
    return response
}

const RegisterComponent = (name, component) => {
    Pairity.Components[name] = component
}

export {
    Pairity,
    Organizations,
    OrganizationMembers,
    Teams,
    TeamMembers,
    UserPreferences,
    RegisterComponent,
    IsTeamAdmin,
    Membership,
    PairHistory
}
