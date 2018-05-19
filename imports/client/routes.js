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

// FlowRouter.route('/signup', {
//     action: function () {
//         if (Meteor.userId()) {
//             FlowRouter.go('/teams')
//         } else {
//             BlazeLayout.render('landingLayout', { content: 'newAccount' });
//         }
//     },
//     name: 'newAccount'
// });

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
        this.register('teams', Meteor.subscribe('singleTeam', params.id))
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

FlowRouter.route('/members/invite/:orgId', {
    subscriptions: function (params) {
        this.register('organizationMembers', Meteor.subscribe('organizationMembers', params.orgId))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'inviteOrgUsers' });
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

