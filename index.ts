///<reference path="typings/tsd.d.ts"/>
var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
var Firebase = require("firebase");
var mongoose = require('mongoose');

let cors                = require('cors');
import mobileRoutes = require("./mobile");

var app = express();

app.use( cors() );

mongoose.connect('mongodb://umar:mumar.5gbfree.com@ds015398.mlab.com:15398/umar');
var ref = new Firebase("https://umrsalesman.firebaseio.com");

/* mongoose schema*/
let userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: {type: String, unique: true, index: true},
    password: String,
    uid: String
});
/*   schema model*/
let userModel = mongoose.model("users", userSchema);


app.use(bodyParser.json());

app.use(function (req, res, next) {
    //  console.log("uid:",req.query.uid , "token:", req.query.token );
    next();
});



app.use("/mobo",mobileRoutes);

app.post("/signUp", function (req, res) {

    /*firebase coding https://www.firebase.com/docs/web/api/firebase/createuser.html*/
    ref.createUser({
        email: req.body.email,
        password: req.body.password
    }, function (error, userData) {
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
            //   console.log("Successfully created user account with uid:", userData.uid);
            /*include data in schema  */
            var newuser:any = new userModel({
                fname: req.body.firstName,
                lname: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                uid: userData.uid
            });
            newuser.save(function (err, data) {
                if (err) {
                    console.log("error Recived from sign up", err);
                  //  res.json({success: false, "msg": "Error Recived", err: err})
                }
                else {
                       console.log("Data Successfully Send to data Base", data," & data._id is ",data._id);
                    res.json({success: true, "msg": "data Send Successfully", data: data._id})
                }
            })
        }
    })
});
app.post("/signIn", function (req, res) {

    console.log(req.body.email, req.body.password);

    ref.authWithPassword({
        "email": req.body.email,
        "password": req.body.password
    }, function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            res.status(401);
            res.send("signin failed");
        } else {
            //  console.log("Authenticated successfully with payload:", authData);
            //res.send("this is authData", authData);
            userModel.findOne({uid: authData.uid}, function (err, record) {
                if (err) {
                    console.log("Error in finding User", err);

                } else {
                    res.json({
                        success: true, "msg": "data Recieved", record: record
                        // uid: req.body.uid
                    });
                    //   console.log("sucessfully user model & record is ", record);
                }
            });
        }
    });
});

var publicPath = path.resolve(__dirname, "salesmenAppUmar/www");
app.use(express.static(publicPath));

app.listen(3000, function () {
    console.log("running 3000");
});

/* company schema*/
let Schema = mongoose.Schema;
let companySchema = Schema({
    companyName: String,
    companyAddress: String,
    companyPhone: Number,
    firebaseUid: String,//{type: Schema.Types.ObjectId, ref: 'users'},
    getSignUp: {type: Schema.Types.ObjectId, ref: 'users'}
});
/* company schema*/

/* company model*/
var company = mongoose.model('company', companySchema);

app.post("/registerCompany", function (req, res) {
    // console.log(req.body);    //
    // userModel.findOne({uid:'0ccad774-cfbc-401f-a052-e42d62681fa8'},(err,data)=>{
    //    if(!err){
    //        console.log("index.ts userModel.findOne user data is ",data," & userModel IS ",userModel.fname)    
    //    }
    //    });
    userModel.findOne({uid: req.body.firebaseUid}, (err, data)=> {
        if (!err) {
            var adminData = new company({
                companyName: req.body.companyName,
                companyAddress: req.body.companyAddress,
                companyPhone: req.body.companyPhone,
                firebaseUid: req.body.firebaseUid,
                getSignUp: data._id
            });

            adminData.save(function (err, adminSave) {
                {
                    if (err) {
                        console.log("error Recived from adminData", err);
                        // res.json({success: false, "msg": "Error Recived", err: err})
                    }
                    else {
                      //  console.log("adminData.save function is ", adminSave);
                        //    console.log("Data Successfully Send to data Base", data);
                        //res.json({success: true, "msg": "data Send Successfully", data: adminSave})
                    }
                }
            }).then(function () {
                    return company
                        .findOne({companyName: req.body.companyName})
                        .populate('getSignUp')
                        .exec(function (err, company) {
                            if (err) {
                                console.log('err in population', err)
                            }
                            else {
                                console.log('The company is ', company);
                                res.json(company);
                            }
                        });
                }
            )
        } else {
            console.log("error findone");
        }
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});
mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////