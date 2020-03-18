const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");
const to = require('await-to-js').default;
const ftp = require('ftp');
const EasyFtp = require('easy-ftp');
const app = express();

//const URI = 'mongodb://localhost/quanlynhahang';
//mongoose.connect(URI, {useNewUrlParser: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Authorization :
//app.use(require('./app/middleware/Authorization'));
// Router
//app.use(require('./routes/index'));

/*
    Working with FTP Server:--------------------------
*/

let configEasyFtp = {
    host: "localhost",
    port: 21,
    username: "vanhuy",
    password: "",
    type: 'ftp'
}
let configFtp = {
    host: "localhost",
    port: 21,
    user: "vanhuy",
    password: ""
}
let ftpClient = new ftp();
let ftpEasy = new EasyFtp();

ftpClient.connect(configFtp);
// note : remotePath form : dont contain /Node/
let remotePath = '/quanlynhahang/SV/adv.mp4';
let localPath = 'F:/Node/quanlynhahang/SV/success.mp4';

ftpClient.on('ready', () => {
    downloadFile(remotePath, localPath, ftpClient)
})

/*
------------------------------------------------------
*/

const server = require('http').createServer(app);
server.listen(3000, function(req, res, next) {
    //console.log('Server is running on port: 3000');
})
// Create folder: 
function createFolder(remotePath, ftpClient) {
    let errors = null;
    ftpClient.mkdir(remotePath,(err) => {
        if(err) errors = err;
    })
    return errors;
}
// Delete folder:
function removeFolder(remotePath, ftpClient) {
    let errors = null;
    ftpClient.rmdir(remotePath,(err) => {
        if(err) errors = err;
    })
    return errors;
}
// Delete file:
function removeFile(remotePath, ftpClient) {
    let errors = null;
    ftpClient.delete(remotePath,(err) => {
        if(err) errors = err;
    })
    return errors;
}
// Write to the end of the file : 
function writeToEndFile(data, remotePath, ftpClient) {
    let errors = null;
    ftpClient.append(data,remotePath, (err) => {
        if(err) errors = err;
        
    })
    return errors
}
// Download file and save file in local file system:
function downloadFile(remotePath, localPath, ftpClient) {
    ftpClient.get(remotePath, (err, stream) => {
        // if(err) errors = err;
        if(!isExistFile(localPath)) fs.appendFile(localPath,"", (err) => {
            if(err) throw err;
        });
        stream.once('close', () => {ftpClient.end()})
        stream.pipe(fs.createWriteStream(localPath));
    })
}
// Upload file txt : 
function uploadFile(localPath, remotePath, ftpClient){
    ftpClient.put(localPath, remotePath, (err) => {
        if(err) throw err;
    })
}
// 4.Check file is exist or not
function isExistFile(path) {
    fs.exists(path, (exists => {
        if(exists) return true;
        else return false
    }))
}