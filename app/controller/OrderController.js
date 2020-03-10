'use strict'

const mongoose = require('mongoose');
const OrderModel = require('../model/OrderSchema');
const BaseController = require('./BaseController');
const to = require('await-to-js').default;

class OrderController extends BaseController{
    constructor(){
        super(OrderController,OrderModel);
    }

    // Store order: 
    async store(req, res, next) {
        let data = req.body;
        // format Id to Object
        data.itemId = mongoose.mongo.ObjectId(data.itemId);
        data.memberId = mongoose.mongo.ObjectId(data.memberId);
        data.userId = mongoose.mongo.ObjectId(data.userId);

        let [err, order] = await to( OrderModel.insertOne(data));
        if(err) return res.status(400).json({ message: "Faild to store order"});
        return res.json(order);
    }

}

module.exports = new OrderController();