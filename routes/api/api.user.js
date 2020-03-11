'use strict'
const UserCtrl = require('../../app/controller/UserController');
module.exports = (Router) => {
    Router.post('/api/login',UserCtrl.login);
}