/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import schemas from '../../imports/lib/schemas';

const should = chai.should();

if (Meteor.isClient) return

const runMongoIdExpectations = (idField) => {
    expect(idField.type.definitions[0].type).to.equal(String)
    expect(idField.type.definitions[0].regEx.source).to.equal('^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17}$')
    expect(idField.optional).to.be.true
}

describe('Schemas', () => {
    describe('Organizations', () => {
        const orgSchema = { ...schemas.Schemas.Organizations._schema }
        it('should have a valid _id field', () => {
            runMongoIdExpectations(orgSchema._id)
        })

        it('should have a valid createdAt field', () => {
            expect(orgSchema.createdAt.type.definitions[0].type).to.equal(Date)
            expect(typeof orgSchema.createdAt.autoValue).to.equal('function')
            expect(orgSchema.createdAt.denyUpdate).to.be.true
            expect(orgSchema.createdAt.optional).to.be.true
        })

        it('should have a valid modifiedAt field', () => {
            expect(orgSchema.modifiedAt.type.definitions[0].type).to.equal(Date)
            expect(typeof orgSchema.modifiedAt.autoValue).to.equal('function')
            expect(orgSchema.modifiedAt.denyInsert).to.be.true
            expect(orgSchema.modifiedAt.optional).to.be.true
        })

        it('should have a valid admins field', () => {
            expect(orgSchema.admins.type.definitions[0].type).to.equal(Array)
            expect(orgSchema.admins.index).to.be.true
        })

        it('should have a valid name field', () => {
            expect(orgSchema.name.type.definitions[0].type).to.equal(String)
            expect(orgSchema.name.index).to.be.true
            expect(orgSchema.name.type.definitions[0].max).to.equal(60)
            expect(orgSchema.name.optional).to.be.false
        })

        it('should have a valid description field', () => {
            expect(orgSchema.description.type.definitions[0].type).to.equal(String)
            expect(orgSchema.description.type.definitions[0].max).to.equal(2048)
            expect(orgSchema.description.optional).to.be.true
        })
    })
})
