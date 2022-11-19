require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const mongoString = process.env.DATABASE_URL;//"mongodb://localhost:27017/datas" //

mongoose.connect(mongoString);
const database = mongoose.connection;
const app = express();

app.use(express.json());

app.use('/api', routes);
// const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const multer = require("multer");
var imageModel = require('./models/imageModel');


app.use(bodyParser.urlencoded(
      { extended:true }
))

app.set("view engine","ejs");

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './img')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

var upload = multer({ storage: storage })

app.get("/",(req,res)=>{
    res.render("index");
})

app.post("/uploadphoto",upload.single('img'),(req,res)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image:new Buffer(encode_img,'base64')
    };
    imageModel.create(final_img,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result.img.Buffer);
            console.log("Saved To database");
            res.contentType(final_img.contentType);
            res.send(final_img.image);
        }
    })
})

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

module.exports = database;