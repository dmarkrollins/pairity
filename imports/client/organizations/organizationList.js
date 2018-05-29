import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Organizations } from '../../lib/pairity'

Template.organizationList.helpers({
    hasOrgs() {
        return Organizations.find().count() > 0
    },
    org() {
        return Organizations.find()
    }
})
