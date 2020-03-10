'use strict'
const OrderCtrl = require("../../app/controller/OrderController");

module.exports = (Router) => {
    Router.post('/api/orders', OrderCtrl.store);
}