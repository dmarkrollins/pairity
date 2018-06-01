import { Meteor } from 'meteor/meteor'

const isSuperAdmin = (userid) => {
    const user = Meteor.users.findOne(userid)

    if (user) {
        if (user.username === 'admin') {
            return true
        }
    }

    return false
}

export default { isSuperAdmin };
