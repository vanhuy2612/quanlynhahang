'use strict'

const mongoose = require('mongoose');
const ItemModel = require('../model/ItemSchema');
const BaseController = require('./BaseController');
const to = require('await-to-js').default;

class ItemController extends BaseController{
    constructor() {
        super(ItemController, ItemModel);
    }
    // Get all item.
    async index(req, res, next){
        let [err, items] = await ItemModel.find({}).sort({name:1});
        if(err) return res.status(400).json({ message: "fail"});
        return res.json(items);
    }
    // Store item to database.
    async store(req, res, next) {
        let data = req.body;
        let [err, item] = await to( ItemModel.insertOne(data) );
        if(err) return res.status(400).json({ message: "Store item fail."});

        return res.json(item);
    }
    // Update item.
    async update(req, res, next){
        let _id = mongoose.mongo.ObjectId(req.params.itemId);
        let data = req.body;

        let [err, item] =await to( ItemModel.updateOne({_id: _id}, data));
        if(err) return  res.status(400).json({ message: "Update user faild"});

        return res.json(item);
    }
    // Delete item.
    async delete(req, res, next) {
        let _id = mongoose.mongo.ObjectId(req.params.itemId);

        let [err, item] = await to(ItemModel.deleteMany({ _id: _id }));
        if (err) {
            return res.status(400).json({ message: 'Fail' });
        }
        return res.json(item);
    }
    // Find item by id.
    async findItemById(req, res, next){
        let _id = mongoose.mongo.ObjectId(req.params.itemId);

        let [err, items] = await to( ItemModel.find({_id: _id}));
        if(err) return res.status(400).json({ message: "Can't find item"});
        return res.json(items);
    }
}

module.exports = new ItemController();