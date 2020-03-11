'use strict'
const BookingCtrl = require("../../app/controller/BookingController");

module.exports = (Router) => {
    Router.delete('/api/bookings/:bookingId', BookingCtrl.delete);
    Router.post('/api/bookings', BookingCtrl.store);
    Router.post('/api/bookings/thongketheoId',BookingCtrl.thongketheoId);
}