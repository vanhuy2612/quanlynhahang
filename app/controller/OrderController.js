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

        let [errInsertOrder, order] = await to( OrderModel.insertOne(data));
        if(errInsertOrder) return res.status(400).json({ message: "Faild to store order"});
        // Change ordersId into ObjectId.
        let ordersId = mongoose.mongo.ObjectId(order._id);
        // Update orders of Item 
        let [errUpdateItem, item] = await to( ItemModel.updateMany({ _id: req.body.item},{$push : {orders:ordersId}}));
        if(errUpdateItem) return res.status(400).json({ message: "Faild to Update item"});
        return res.json({
            "Order" : order,
            "Item" : item
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
    // Example:  thong ke theo itemId
    async thongketheoId(req, res, next){
    
        let [err, result] = await to( ItemModel.find({}).populate("orders","quantity price"));
        if(err) return res.status(400).json({ message: "Thong ke that bai"});
        return res.json(result);
    }
    // Example Thống kê kèm điều kiện:
    async thongke(req, res, next) {
        let [err, result] = await to( ItemModel.find({}).populate({
            path : "orders",
            match: { $expr: 
                {$gt: 
                    [ {$multiply : ["$price","$quantity"]}, 300000 ]
                } 
            },
            //match: { price: { $gte: 200000 } },
            select: "price quantity"
        }));
        console.log('err', err);
        if(err) return res.status(400).json({ message: "Thong ke that bai"});
        return res.json(result);
    }
    // Example  thong ke dac biet : 
    async thongkedacbiet(req, res, next) {
        let [err, result] = await to (
            OrderModel.aggregate([
                {$group: {// Khai báo tất cả các trường order cần lấy.
                    _id:"$item",
                    total: { $sum: { $multiply: ["$price","$quantity"]}},
                    // price: "$price",
                    totalQuantity: {$sum: '$quantity'},
                    totalPrice : {$avg: "$price"}
                }},
                /*
                    +Đầu ra sau khi group là các trường _id, total, totalQuantity, totalPrice
                    +nếu không truyền 2 giá trị totalQuantity, totalPrice thì otherTotal 
                        ở phía dưới sẽ không hoạt động
                */  
                {$addFields: {
                    des : "example",
                    otherTotal : { $sum: { $multiply: ["$totalQuantity","$totalPrice"]}}
                }},          
                {$match: { 
                    total: {$gte: 0} 
                }},
                {$project: { // In các trường trong result theo ten minh muon
                    item: "$_id",
                    total: "$total",
                    otherTotal: "$otherTotal",
                    des : "$des"
                }},
                {$sort: {total:1}}
            ])
        )
        if(err) return res.json(err);
        return res.json(result);
    }
    // Order statistics by item : 
    async orderStatiscsByItem(req, res, next){
        let [err, order] = await to( OrderModel.aggregate([
            // Group chỉ tìm đến những trường có trong _id ( _id là bắt buộc)
            {$group: {
                _id: "$item",
                total: {$sum: {$multiply: ["$price","$quantity"]}}
            }},// Output contains 2 field: _id, total.
            {$lookup:{
                from: "items",
                localField: "_id", //field from the input documents 
                foreignField: "_id", // field from the documents of the "from" collection
                as : "itemDetails"
            }},
            {$project:{
                item: "$itemDetails",
                total: "$total"
            }}
        ]))
        if(err) return res.status(400).json({"Error":err});
        return res.json(order);
    }
}

module.exports = new OrderController();