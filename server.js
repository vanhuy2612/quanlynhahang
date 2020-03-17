const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");
const to = require('await-to-js').default;
const app = express();

//const URI = 'mongodb://localhost/quanlynhahang';
//mongoose.connect(URI, {useNewUrlParser: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Authorization :
//app.use(require('./app/middleware/Authorization'));
// Router
//app.use(require('./routes/index'));


const url = 'F:/Node/quanlynhahang/routes';
const urlDelete = 'F:/Node/quanlynhahang/example';

// 1.Get details of a folder
let readFolder = () => {
    fs.readdir(url, (err, files) => {
        if(err) console.log("Errors: " + err);
        else{
            files.forEach( (file) => {
                file = url+ "/" + file;
                fs.stat(file, (err, stats) => {
                    console.log(file);
                    console.log(path.extname(file));
                    console.log(stats);
                })
            })
        }
    })
}
readFolder();
// 2.Read File:
let readFile = () => {    
    fs.readFile(url, (err, data) => {
        if (err) console.log("Error:" +err);
        else console.log("Data:"+data);
    })
}
// 3.1Override File
let overrideFile = () => {
    let data = "File is modified."
    fs.writeFile(url,data, (err) => {
        if (err) console.log("Error: "+err);
        else console.log("File is modified.");
    })
    readFile();
}
// 3.2Write to the end of a file
let writeToEndFile = () => {
    let data = " Write to end file";
    fs.appendFile(url, data, (err) => {
        if(err) console.log("Error: "+ err);
        else console.log("File is appended.");
    }) 
    readFile();
}
// 4.Check file is exist or not
let isExistFile = (url) => {
    fs.exists(url, (exists => {
        if(exists) console.log("File is exists.");
        else console.log("File is not exists.")
    }))
}
// 5.Copy content of a file to an other file.
let copyFileIntoFile = () => {
    let source = 'F:/Node/quanlynhahang/SVsource.txt';
    fs.copyFile(url, source, (err) => {
        if(err) console.log("Errors: "+ err);
        else console.log("File was copied.")
    })
}
// Copy a file of a folder to another folder: <em đang nghĩ>
let copyFileIntoFolder = () => {
    
}
//6. Delete file or foler:
let deleteFile = (url) => {
    if(path.extname(url) != "") {
        fs.unlink(url, (err) => {
            if(err) console.log('Errors: '+err);
            else console.log("File was deleted.");
        })
    }
    else {
        fs.rmdir(urlDelete, (err) => {
            if(err) console.log('Errors: '+err);
            else console.log("Folder was deleted.");
        })
    }
    
}


const server = require('http').createServer(app);
server.listen(3000, function(req, res, next) {
    //console.log('Server is running on port: 3000');
})
