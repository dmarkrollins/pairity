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

FlowRouter.route('/teams', {
    action: function () {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        } else {
            BlazeLayout.render('workLayout', { content: 'teamList' });
        }
    },
    name: 'teams'
});
