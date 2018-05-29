import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/kadira:flow-router'

Accounts.onEnrollmentLink((token, done) => {
    FlowRouter.go(`/enroll/${token}`)
    done()
})
