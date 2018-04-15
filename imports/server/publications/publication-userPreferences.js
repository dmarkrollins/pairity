import { Meteor } from 'meteor/meteor'

import { Pairity } from '../../../imports/lib/pairity'

Meteor.publish('myPrefs', function (search) {
    if (!this.userId) {
        return null
    }

    const self = this;

    const options = {
        userPreferences: 1
    }

    const handle = Meteor.users.find(this.userId, options)
        .observeChanges({
            added: function (id, fields) {
                self.added(Pairity.UserPreferences, id, fields);
            },
            changed: function (id, fields) {
                self.changed(Pairity.UserPreferences, id, fields);
            },
            removed: function (id) {
                self.removed(Pairity.UserPreferences, id);
            }
        })

    self.ready();

    self.onStop(function () {
        handle.stop();
    });
})
