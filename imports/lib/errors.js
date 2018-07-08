import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'

const Errors = {}

Errors.types = [
    { key: 'logged-in', message: 'You must not be logged in to perform this action!' },
    { key: 'not-logged-in', message: 'You must be logged in to perform this action!' },
    { key: 'not-found', message: '{0} not found!' },
    { key: 'duplicate-found', message: 'You already have a {0} like this defined!' },
    { key: 'invalid-format', message: 'The format of the {0} document provided is invalid!' },
    { key: 'not-admin', message: 'You must be the team administrator to perform this action!' },
    { key: 'insert-failed', message: '{0} insert failed. Please try again later!' },
    { key: 'update-failed', message: '{0} update failed. Please try again later!' },
    { key: 'delete-failed', message: '{0} delete failed. Please try again later!' },
    { key: 'duplicate-user-in-org', message: 'User has already been added to {0}!' }
]

Errors.create = (key, value = 'Item') => {
    if (key === 'custom') {
        return new Meteor.Error('error', value)
    }

    const err = _.find(Errors.types, item => item.key === key)

    if (!err) {
        return new Meteor.Error('unknown', 'An unknown error occurred!')
    }

    return new Meteor.Error(err.key, err.message.format(value))
}

export { Errors }
