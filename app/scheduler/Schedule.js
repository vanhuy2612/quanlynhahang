'use strict'

const Schedule = require('node-schedule');

const BookingScheduler = require('./BookingScheduler')(Schedule);

module.exports = (req, res, next) => {
    BookingScheduler();
};