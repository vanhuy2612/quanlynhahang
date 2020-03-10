'use strict'

const Router = require('express').Router();
// Router for items : 
require('./api/api.item')(Router);
require('./api/api.order')(Router);
require('./api/api.booking')(Router);

module.exports = Router;
