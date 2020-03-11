'use strict'

const Router = require('express').Router();
// Router for items : 
require('./api/api.item')(Router);
require('./api/api.order')(Router);
require('./api/api.booking')(Router);
require('./api/api.user')(Router);

module.exports = Router;
