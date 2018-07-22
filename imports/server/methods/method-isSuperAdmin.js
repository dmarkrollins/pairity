import { Meteor } from 'meteor/meteor'

Meteor.methods({
    isSuperAdmin() {
        if (!this.userId) {
            return false
        }

        const user = Meteor.users.findOne(this.userId)

        if (user) {
            if (user.username === 'admin') {
                return true
            }
        }

        return false
    }
})
