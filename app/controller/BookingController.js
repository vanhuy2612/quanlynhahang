'use strict'

const mongoose = require('mongoose');
const BookingModel = require('../model/BookingSchema');
const ItemModel = require('../model/ItemSchema');
const BaseController = require('./BaseController');
const to = require('await-to-js').default;


class BookingController extends BaseController{
    constructor(){
        super(BookingController,BookingModel);
    }
    // Store Hoa Don: 
    async store(req, res, next){
        let data = req.body;
        let [err, booking] = await to( BookingModel.insertOne(data));
        if(err) return res.status(400).json({ message: "Store Booking faild"});
        return res.json(booking);
    }
    async delete(req, res, next){
        let _id = req.params.bookingId;

        let [err, booking] = await to( BookingModel.deleteMany({ }));
        if(err) return res.status(400).json({ message: "Delete booking fail"});
        return res.json(booking);
    }
    // Get all Booking Statistic by User :
    async getAllBookingStatisticGroupByUser(req, res, next){
        let [err, booking] = await to( BookingModel.aggregate([       
            // {$lookup: {
            //     from: 'orders',
            //     localField: "order",
            //     foreignField: "_id",
            //     as: "order" 
            // }},
            // {$group: {
            //     _id: "$user",            
            //     orders: {$push : "$order"},     
            // }},
            // {$project: {
            //     user: "$_id",
            //     orders: "$orders"
            // }}
            //-------------------------------------------------------------------
            {$lookup: {
                from: 'orders',
                localField: "order",
                foreignField: "_id",
                as: "order" 
            }},
            {$unwind: "$order"},// Tách ra rồi group lại để tính total.
            {$group: {
                _id: "$user",
                total: {$sum: {$multiply: ["$order.price","$order.quantity"]}},
            }},
            {$group: {
                _id:null,
                // user: "$user",  
                list:{$push:
                    {$mergeObjects: {user:"$_id",total: "$total"}},  
                },                                      
                totalAll: {$sum: "$total"},          
            }},
        
            {$project: {
                list: "$list",
                //order: "$order",
                totalAll: "$totalAll", // Tổng số tiền 
            }}
        ]));
        if(err) return res.status(400).json({"Errors": err});
        return res.json(booking);
    }
    // Get Booking Statistic by User : 
    async getBookingStatisticByUser(req, res, next){
        let userId = mongoose.mongo.ObjectId(req.params.userId);

        let [err, result] = await to(BookingModel.aggregate([       
            {$match:{
                user: userId // userId in request.
            }},
            {$lookup: {
                from: 'orders',
                localField: "order",
                foreignField: "_id",
                as: "order" 
            }},
            {$unwind: "$order"},// Tách ra rồi group lại để tính total.
            {$lookup: {
                from: "items",
                localField: "order.item",
                foreignField: "_id",
                as: "order.item"
            }},
            {$group: {
                _id: "$user",
                total: {$sum: {$multiply: ["$order.price","$order.quantity"]}},
                orders : {$push: "$order"}
            }},
           
            {$project: {
                user: "$_id",
                orders: "$orders",// Danh sách các order
                //order: "$order",
                total: "$total", // Tổng số tiền 
            }}
        ]));
        if(err) return res.status(400).json({"Errors": err});
        return res.json(result);
    }
    // thong ke doanh thu theo ngay:
    async getIncomeOfEndDay(req, res, next){
        let today = new Date();
        let yesterday = new Date( today.setDate( today.getDate() - 1));
        let startDay = new Date( yesterday.setHours(0,0,0,0) );
        let endDay = new Date( yesterday.setHours(23,59,59,999) );

        console.log(startDay+" "+endDay);

        let [err, result] = await to( BookingModel.aggregate([
            {$match: {
                'paymentTime': {$gte: startDay},
                'paymentTime': {$lte: endDay}
            }},
            {$lookup: {
                from: 'orders',
                localField: 'order',
                foreignField: '_id',
                as: 'order'
            }},
            {$unwind: "$order"},// Tách ra rồi group lại để tính total.
            {$group: {
                _id: '$order.item',
                income: {
                    $sum: {
                        $multiply: ['$order.quantity','$order.price']
                    }
                }
            }},
            {$group: {
                _id: null,
                list: {$push: 
                    {$mergeObjects: {item:"$_id",income: "$income"}}
                },
                total: {$sum: "$income"}
            }},
            {$project: {
                list: "$list",
                total: "$total"
            }}
        ]) )
        if (err) return res.status(404).json({Errors: err,messege: "Fail to calculte Income everyday"}) 
        return res.json({result});
    }
}

module.exports = new BookingController();