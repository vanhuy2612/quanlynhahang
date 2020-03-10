'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');

const mTAG = 'bookings';
const projection  = { delete: 0, __v: 0};
const FIELDS ={
    orderId: {type: String},
    memberId: {type: String},
    paymentTime: {type: Date, default: Date.now},
    insert: {
        when: { type: Date, default: Date.now },
        by: { type: Schema.ObjectId, ref: 'User' }
    },

    update: {
        when: { type: Date },
        by: { type: Schema.ObjectId, ref: 'User' }
    },

    delete: {
        when: { type: Date },
        by: { type: Schema.ObjectId, ref: 'User' }
    }
}

let bookingSchema = BaseSchema(FIELDS, projection);

module.exports = mongoose.model(mTAG, bookingSchema);