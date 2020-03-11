'use strict'

const mongoose = require('mongoose');
const OrderModel = require('../model/OrderSchema');
const ItemModel = require('../model/ItemSchema');
const BaseController = require('./BaseController');
const to = require('await-to-js').default;

class OrderController extends BaseController{
    constructor(){
        super(OrderController,OrderModel);
    }

    // Store order: 
    async store(req, res, next) {
        let data = req.body;

        let [err1, order] = await to( OrderModel.insertOne(data));
        if(err1) return res.status(400).json({ message: "Faild to store order"});
        // Store ordersId into collection item.
        let ordersId = mongoose.mongo.ObjectId(order._id);
        
        let [err3, item2] = await to( ItemModel.updateMany({ _id: req.body.item},{$push : {orders:ordersId}}));
        if(err3) return res.status(400).json({ message: "Faild to Update item"});
        return res.json({
            "Order" : order,
            "Item" : item2
        });
    }
    // Delete order.
    async delete(req, res, next){
        let _id = req.params.orderId;

        //let [err, order] = await to( OrderModel.deleteOne({ _id: _id}));
        let [err, order] = await to( OrderModel.deleteMany({}));
        if(err) return res.status(400).json({ message: "Delete order fail"});
        return res.json(order);
    }
    // thong ke theo itemId
    async thongketheoId(req, res, next){
    
        let [err, result] = await to( ItemModel.find({}).populate("orders","quantity price"));
        if(err) return res.status(400).json({ message: "Thong ke that bai"});
        return res.json(result);
    }
    // Thống kê kèm điều kiện: 
    async thongke(req, res, next) {
        let [err, result] = await to( ItemModel.find({}).populate({
            path : "orders",
            match: { $expr: {$gt: [{$multiply : ["$price","$quantity"]}, 300000]} },
            //match: { price: { $gte: 200000 } },
            select: "price quantity"
        }));
        console.log('err', err);
        if(err) return res.status(400).json({ message: "Thong ke that bai"});
        return res.json(result);
    }
}

module.exports = new OrderController();