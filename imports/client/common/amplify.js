/* global amplify */
// uses amplify to store persisted values in local storage
// since it references session it is also reactive :)
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { _ } from 'meteor/underscore'

import { Pairity } from '../../lib/pairity'

const AmplifiedSession = _.extend({}, Session, {
    keys: _.object(_.map(amplify.store(), function (value, key) {
        return [key, JSON.stringify(value)]
    })),
    set: function (key, value) {
        Session.set.apply(this, arguments); // eslint-disable-line
        amplify.store(key, value);
    },
});

module.exports = { AmplifiedSession }
