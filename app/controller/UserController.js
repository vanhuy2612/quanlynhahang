'use strict' 
const AuthConfig = require('../../config/Authorization');
const jwt = require('jsonwebtoken');
const BaseController = require('./BaseController');
class UserController extends BaseController {
    constructor(){
        super(BaseController);
    }
    async login(req, res, next) {
        let token = jwt.sign(req.body, AuthConfig.salt,{
            expiresIn : '3h'
        });
        return res.json({token});
    }
}
module.exports = new UserController();