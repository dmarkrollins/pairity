import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import { Pairity } from '../lib/pairity'

BlazeLayout.setRoot('#flow-container');

FlowRouter.route('/signin', {
    action: function () {
        if (Meteor.userId()) {
            FlowRouter.go('/teams')
        } else {
            BlazeLayout.render('landingLayout', { content: 'signIn' });
        }
    },
    name: 'sign-in'
});

FlowRouter.route('/enroll/:token', {
    action: function (argument) {
        if (Meteor.userId()) {
            FlowRouter.go('/teams');
        }
        BlazeLayout.render('landingLayout', { content: 'enrollUser' });
    },
    name: 'enroll-user'
})

FlowRouter.route('/signup', {
    action: function () {
        if (Meteor.userId()) {
            FlowRouter.go('/teams')
        } else {
            BlazeLayout.render('landingLayout', { content: 'newAccount' });
        }
    },
    name: 'new-account'
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
    name: 'create-organization'
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
    name: 'create-organization'
})

FlowRouter.route('/organizations/invite/:id', {
    subscriptions: function (params) {
        this.register('singleorganization', Meteor.subscribe('singleOrg', params.id))
        this.register('organizationmembers', Meteor.subscribe('inviteMembers', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'inviteOrgMembers' });
        }
    },
    name: 'invite-organization-members'
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

FlowRouter.route('/teams/dash/:id', {
    subscriptions: function (params) {
        this.register('singleteam', Meteor.subscribe('singleTeam', params.id))
        this.register('teammembers', Meteor.subscribe('teamMembers', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'teamDash' });
        }
    },
    name: 'team-dashboard'
})

FlowRouter.route('/teams/new', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'newTeam' });
        }
    },
    name: 'create-team'
})

FlowRouter.route('/teams/manage/:id', {
    subscriptions: function (params) {
        this.register('singleteam', Meteor.subscribe('singleTeam', params.id))
        this.register('teammembers', Meteor.subscribe('teamMembers', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'manageTeam' });
        }
    },
    name: 'manage-team'
})

FlowRouter.route('/teams/members/:id', {
    subscriptions: function (params) {
        this.register('teams', Meteor.subscribe('singleTeam', params.id))
        this.register('teammembers', Meteor.subscribe('teamMembers', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'teamMembers' });
        }
    },
    name: 'manage-team'
})

FlowRouter.route('/teams/members/invite/:id', {
    subscriptions: function (params) {
        this.register('teams', Meteor.subscribe('singleTeam', params.id))
        this.register('teammembers', Meteor.subscribe('teamMembers', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'inviteTeamMembers' });
        }
    },
    name: 'invite-team-members'
})

FlowRouter.route('/teams/pairs/:id', {
    subscriptions: function (params) {
        this.register('teams', Meteor.subscribe('singleTeam', params.id))
        this.register('assignmentmembers', Meteor.subscribe('assigmentMembers', params.id))
    },
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'pairsAssign' });
        }
    },
    name: 'invite-team-members'
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
    name: 'user-preferences'
})
