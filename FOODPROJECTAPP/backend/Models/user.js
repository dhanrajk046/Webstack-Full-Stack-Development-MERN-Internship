//Schema
const mongoose = require("mongoose")

const validator = require("validator")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const crypto = require("crypto")
// const { type } = require("os")
const { stringify } = require("querystring")


//step 2 create Schema

const userSchema = new mongoose.Schema({
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
    },
    avatar:{
        public_id:String,
        url: String,
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordReserExpires:Date,
},
{timestamps:true}
);

//hash password
//pre("save") => runs before data is saved

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

//pass compare
userSchema.methods.corectPassword = async function(
    candidatePassword, userPassword
){
    return await bcrypt.compare(candidatePassword,userPassword)
    
}

//checks whether the users apssword was change afeter getting jwt tokens 
// if yes. the old token is invalid and user must log in again
userSchema.methods.changepasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.gettime()/1000,10
        )
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

//custom method to generate the jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRETS,
        {expiresIn: process.env.JWT_EXPIRES}
    )
}

module.exports = mongoose.model("User", userSchema)

