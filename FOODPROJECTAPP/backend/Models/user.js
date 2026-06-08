//Schema
const mongoose = require("mongoose")

const validator = require("validator")

const bycrypt = require("bycryptjs")

const jwt = require("jsonwebtoken")

const crypto = require("crypto")
const { type } = require("os")
const { stringify } = require("querystring")


//step 2 create Schema

const userSchema = new mongoose.schema({
    name:{
        type: String,
        required:[true, "please enter your name"],
        maxlength:[30,"Name cannot exceed 30 characters"]
    },
    email:{
        type: String,
        required:[true, "please enter emailid"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Enter valid email"]
    },
    password:{
        type:String,
        required:[true,"Enter password"],
        minlength:6,
        select:false,
    },
    passwordConfirm:{
        type: String,
        required:[true, "Comfirm password"],
        validate:{
            validator: function(e1){
                return e1 === this.password
            },
            message: "Passwords are not same"
        }
    },
    phoneNumber:{
        type: String,
        required : true,
        match : [/^[0-9]{10}$/, "Enter valid phone number"]
    },
    role:{
        type:String,
        enum:["user","admin"],
        default: "user"
    }
})