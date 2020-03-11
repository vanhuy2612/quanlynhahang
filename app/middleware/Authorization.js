'use strict'
const AuthConfig = require("../../config/Authorization");
const jwt = require('jsonwebtoken');
const to = require('await-to-js').default;
const ignorePath = [
    '/api/login',
    '/api/register',
    '/favicon.'
]
module.exports = (req, res, next) => {
    let path = req.url;
    if(ignorePath.includes(path)) next();
    else {
        let token = req.header('Authorization');
        if (!token) { // bao loi 401 Unauthorized khi ko tim thay token trong header.
            return res.status(401).json({ message: 'Ko có chuỗi token' });
        }
        let result = jwt.verify(token,AuthConfig.salt, (err,decoded) => {
            if(err!=null)
                return res.status(401).json({ message: 'Chuỗi token sai.' });
        })
        next();
    }   
}