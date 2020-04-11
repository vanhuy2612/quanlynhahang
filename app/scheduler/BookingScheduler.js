'use strict'

const BookingCtrl = require('../controller/BookingController')

module.exports = (Schedule) => {
    Schedule.scheduleJob('0 0 0 * * *', BookingCtrl.getIncomeOfEndDay);
}