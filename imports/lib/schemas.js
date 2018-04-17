// import SimpleSchema from 'simpl-schema'
import SS from 'simpl-schema'

SS.extendOptions(['autoform']);
const SimpleSchema = class extends SS {
    constructor(schema) {
        Object.keys(schema).forEach((k) => {
            if (schema[k].type instanceof Array) {
                const type = schema[k].type[0];
                schema[k].type = Array;
                schema[`${k}.$`] = { type }
            }
        })
        super(schema);
    }
}

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

Schemas.Organizations = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
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
    admins: {
        type: [String],
        index: true
    },
    name: {
        type: String,
        index: true,
        optional: false,
        max: 60
    },
    description: {
        type: String,
        optional: true,
        max: 2048
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
    },
    technologies: {
        type: [String],
        optional: true
    },
    // 'technologies.$': String,
    roles: {
        type: [String],
        optional: true
    },
    // 'roles.$': String
    // admins: [String],
    // members: [String]
})

Schemas.TeamMembers = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    organizationId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    teamId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
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
    isAdmin: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    isPresent: {
        type: Boolean,
        optional: true,
        defaultValue: true
    }
})

Schemas.UserPreferences = new SimpleSchema({
    primaryRole: {
        type: String,
        allowedValues: ['Engineer', 'Product', 'Design']
    }
})

module.exports = { Schemas };
