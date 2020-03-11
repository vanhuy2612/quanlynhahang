'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');

const mTAG = 'orders';
const projection  = { delete: 0, __v: 0};
const FIELDS ={
    quantity : {type: Number},
    price : { type: Number},
    item : { type: mongoose.SchemaTypes.ObjectId, ref: "items"},
    user : {type: mongoose.SchemaTypes.ObjectId, ref: "members"},
    member : {type: mongoose.SchemaTypes.ObjectId, ref: "members"},
    timeOrder : {type: Date},
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

let orderSchema = BaseSchema(FIELDS, projection);

module.exports = mongoose.model(mTAG, orderSchema);