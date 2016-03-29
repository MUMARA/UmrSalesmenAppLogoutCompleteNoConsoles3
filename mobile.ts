///<reference path="typings/tsd.d.ts"/>

import express = require("express");
import http = require("http");
import path = require("path");
import mongoose = require('mongoose');
var Firebase = require("firebase");
var bodyParser = require("body-parser");
var app = express();
 let api = express.Router();

//mongoose.connect('mongodb://umar:mumar.5gbfree.com@ds015398.mlab.com:15398/umar');
var ref = new Firebase("https://umrsalesman.firebaseio.com");



/* mongoose schema*/
let salesmanSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: {type: String, unique: true, index: true},
    Password: String,
    MobileNumber: Number,
    NICNumber:Number,
    Comments:String,
  //  adminSignUpMongoUid:String,
    uid:String
});
/*   schema model*/
let salesman = mongoose.model("salemanUsers", salesmanSchema);

app.use(bodyParser.json());

// app.use(function (req, res, next) {
//     //  console.log("uid:",req.query.uid , "token:", req.query.token );
//     next();
// });

api.post("/salesmanSignup",function(req,res){

    console.log(req.body);
    /*firebase coding https://www.firebase.com/docs/web/api/firebase/createuser.html*/
    
    ref.createUser({
        email: req.body.email,
        password: req.body.password
    }, function(error, userData) {
        if (error) {
            switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
            }
        } else {
            console.log("Successfully created user account with uid:", userData.uid);


            /*include data in schema  */
            var salemanSignUpSchema:any = new salesman({
                FirstName: req.body.firstName,
                LastName: req.body.lastName,
                Email: req.body.email,
                Password: req.body.password,
                MobileNumber: req.body.mobileNumber,
                NICNumber :req.body.nicNumber,
                Comments:req.body.comments,
               // adminSignUpMongoUid:req.body.usersMongoUids,
                uid:userData.uid,
            });
            salemanSignUpSchema.save(function (err, data) {
                if (err) {
                    console.log("error Recived from salemanSignUpSchema", err);
                    //  res.json({success: false, "msg": "Error Recived", err: err})
                }
                else {
                    console.log("Data of salemanSignUpSchema Successfully Send to data Base", data," & data._id is ",data._id);
                    res.json({success: true, "msg": "data of salemanSignUpSchema Send Successfully", data: data._id})

                }

                });

        }

   });

});

module.exports = api;
