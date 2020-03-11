const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const app = express();

const URI = 'mongodb://localhost/quanlynhahang';
mongoose.connect(URI, {useNewUrlParser: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Authorization :
app.use(require('./app/middleware/Authorization'));
// Router
app.use(require('./routes/index'));


const server = require('http').createServer(app);
server.listen(3000, function(req, res, next) {
    console.log('Server is running on port: 3000');
})
