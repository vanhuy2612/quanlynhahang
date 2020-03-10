'use strict'
const ItemCtrl = require('../../app/controller/ItemController');

module.exports = (Router) => {
    Router.get('/api/items',ItemCtrl.index);
    Router.get('/api/items/:itemId',ItemCtrl.findItemById);
    Router.post('/api/items', ItemCtrl.store);
    Router.delete('/api/items/:itemId', ItemCtrl.delete);
    Router.put('/api/items/:itemId', ItemCtrl.update);
}