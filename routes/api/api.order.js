'use strict'
const OrderCtrl = require("../../app/controller/OrderController");

module.exports = (Router) => {
    Router.post('/api/orders', OrderCtrl.store);
    Router.delete('/api/orders/:orderId', OrderCtrl.delete);
    Router.post('/api/orders/thongketheoId', OrderCtrl.thongketheoId);
    Router.post('/api/orders/thongke', OrderCtrl.thongke);   
}