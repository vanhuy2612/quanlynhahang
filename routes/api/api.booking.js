'use strict'
const BookingCtrl = require("../../app/controller/BookingController");

module.exports = (Router) => {
    Router.post('/api/bookings', BookingCtrl.store);
}