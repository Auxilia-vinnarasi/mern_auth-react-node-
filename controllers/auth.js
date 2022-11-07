const { JsonWebTokenError } = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


// exports.register=(req,res,next)=>{
//     res.send("register route");
// }

//register the user
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    
    //before we save the user we have to create the hashing password
    // we have to encrypt the password for this go to User.js in models
   
    // res.status(201).json({
    //   success: true,
    //   code: 201,
    //   message: "registration successfully Done",

    sendToken(user,201,res);
      //user: user,
    }
 catch (err) {
    console.log(err);
    //return res.status(500).json({
      // success: false,
      // error: err.message,
      next(err);
      // code:500,
      // message:"Error: "+ err
    //});
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // res
    //   .status(400)
    //   .json({ success: false, error: "Please provide email and password" });
    return next(new ErrorResponse("Please provide email and password",400))
  }
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // res.status(404).json({ success: false, error: "Invalid credentials" });
    return next(new ErrorResponse("Invalid Credentials",401));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      // res.status(404).json({ success: false, error: "Invalid credentials" });
    return next(new ErrorResponse("Invalid Credentials",401));
    }

    // res.status(200).json({
    //   success: true,
    //   code: 200,
    //   token: "woikdlsd78dsdksl",
    // });
    sendToken(user,200,res);

  } catch (err) {
    // console.log(err);
    // res.status(500).json({
    //   success: false,
    //   code: 500,
    //   error: err.message,
    // });
    next(err);
  }
};

//201-it signifies created status
//200- it signifies ok

exports.forgotPassword = (req, res, next) => {
  res.send("forgotPassword route");
};

exports.resetPassword = (req, res, next) => {
  res.send("reset Password route");
};

//this sendtoken function will have access to the user,status code
//user which we created using email and passord..
const sendToken=(user,statusCode,res)=>{
  const token=user.getSignedToken();
  res.status(statusCode).json({success:true,token})
};

