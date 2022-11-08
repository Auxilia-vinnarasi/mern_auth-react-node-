//using mongoose we can create schemas,and validate schemas

var crypto=require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide a User Name"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//encrypt the password
//we want to run before its get saved
//which is rehashing which means saving the current password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //if the password is not modified save the current password
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();

});

//this function going to receive the password from the user and compare this with this.password
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}

//this function going to use jwt
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

//this function we are going to use resetpassword Token
UserSchema.methods.getResetPasswordToken=function(){
  const resetToken=crypto.randomBytes(20).toString("hex");
  //hash this token save the hashed token there in above  ( resetPasswordToken: String, )
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire=Date.now() + 10 *(60 * 1000);//10*1 min  add it to the current Date
  return resetToken;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
