import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import { Pairity } from '../lib/pairity'

BlazeLayout.setRoot('#flow-container');

FlowRouter.route('/', {
    action: function () {
        if (Meteor.userId()) {
            FlowRouter.go('/teams')
        } else {
            BlazeLayout.render('landingLayout', { content: 'signIn' });
        }
    },
    name: 'signIn'
});

FlowRouter.route('/enroll/:token', {
    action: function (argument) {
        if (Meteor.userId()) {
            FlowRouter.go('/teams');
        }
        BlazeLayout.render('landingLayout', { content: 'enrollUser' });
    },
    name: 'EnrollUser'
})

FlowRouter.route('/signup', {
    action: function () {
        if (Meteor.userId()) {
            FlowRouter.go('/teams')
        } else {
            BlazeLayout.render('landingLayout', { content: 'newAccount' });
        }
    },
    name: 'newAccount'
});

FlowRouter.route('/organizations', {
    subscriptions: function (params) {
        this.register('organizations', Meteor.subscribe('allOrgs'))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'organizationList' });
        }
    },
    name: 'organizations'
})

FlowRouter.route('/organizations/new', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'newOrganization' });
        }
    },
    name: 'createorganization'
})

FlowRouter.route('/organizations/edit/:id', {
    subscriptions: function (params) {
        this.register('singleorganization', Meteor.subscribe('singleOrg', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'editOrganization' });
        }
    },
    name: 'createorganization'
})

FlowRouter.route('/organizations/invite/:id', {
    subscriptions: function (params) {
        this.register('singleorganization', Meteor.subscribe('singleOrg', params.id))
        this.register('organizationmembers', Meteor.subscribe('organizationMembers', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'inviteOrgMembers' });
        }
    },
    name: 'inviteorganizationmembers'
})

FlowRouter.route('/teams', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'teamList' });
        }
    },
    name: 'teams'
})

FlowRouter.route('/teams/new', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'newTeam' });
        }
    },
    name: 'createteam'
})

FlowRouter.route('/teams/manage/:id', {
    subscriptions: function (params) {
        this.register('singleteam', Meteor.subscribe('singleTeam', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'manageTeam' });
        }
    },
    name: 'manageteam'
})

FlowRouter.route('/teams/members/:teamId', {
    subscriptions: function (params) {
        this.register('teams', Meteor.subscribe('singleTeam', params.teamId))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'teamMembers' });
        }
    },
    name: 'manageteam'
})

FlowRouter.route('/preferences', {
    subscriptions: function (params) {
        this.register('preferences', Meteor.subscribe('myPrefs'))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'userPreferences' });
        }
    },
    name: 'userPreferences'
})

