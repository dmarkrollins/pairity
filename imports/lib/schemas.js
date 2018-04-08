import SimpleSchema from 'simpl-schema'

const Schemas = {}

Schemas.Location = new SimpleSchema({
    city: {
        type: String,
        max: 60
    },
    state: {
        type: String,
        max: 2
    },
    postalCode: {
        type: String,
        max: 15
    }
})

Schemas.Teams = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isInsert) {
                return this.userId;
            }
            this.unset()
        },
        denyUpdate: true,
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
            this.unset()
        },
        denyUpdate: true,
        optional: true
    },
    modifiedAt: {
        type: Date,
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    },
    name: {
        type: String,
        max: 128
    },
    description: {
        type: String,
        max: 8192
    }
    // location: {
    //     type: String,
    //     optional: true
    // },
    // admins: [String],
    // technologies: [String],
    // rolesNeeded: [String],
    // members: [String]
})

Schemas.TeamTech = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    teamId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        denyUpdate: true
    },
    name: {
        type: String,
        max: 60
    }
})

Schemas.TeamRoles = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    teamId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        denyUpdate: true
    },
    name: {
        type: String,
        max: 60
    }
})

module.exports = { Schemas }
