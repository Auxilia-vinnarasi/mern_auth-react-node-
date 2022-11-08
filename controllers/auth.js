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

exports.forgotPassword = async (req, res, next) => {
  //we gonna get email from the body
  const {email}=req.body;
  //we have to find out this user in our db is existing or not
  try{
    const user=await User.findOne({email})
    if(!user){
      return next (new ErrorResponse("Email could not sent",404))
    }
    //so after finding the user we have to send the reset token;
    const resetToken=user.getResetPasswordToken();
    await user.save(); //To the data base its saved..

    //this one is frontend domain..
    const resetUrl=`http://localhost:3000/passwordreset/${resetToken}`;
//this message go to the client
//client will see that is where its gonna redirecting
    const message=`
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `
    //while we using (email service)sendGrid email notifications rerouting to weird email link 
  
    //after that we have to send mail here in try catch
    try{
      
    }
    catch(err){

    }
  }
  catch(err){

  }
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

