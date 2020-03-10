'use strict'

const mongoose = require('mongoose');
const BookingModel = require('../model/BookingSchema');
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
    // Thong ke theo itemID:

}

module.exports = new BookingController();