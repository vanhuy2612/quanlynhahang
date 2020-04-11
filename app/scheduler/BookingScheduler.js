'use strict'

const BookingCtrl = require('../controller/BookingController')

module.exports = (Schedule) => {
    // Thống kê vào lúc 0h00 : thống kê doanh thu ngày hôm trước
    Schedule.scheduleJob('0 0 0 * * *', BookingCtrl.getIncomeOfEndDay);
}