const User = require("../models/User");

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
    res.status(201).json({
      success: true,
      code: 201,
      message: "registration successfully Done",
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message,
      // code:500,
      // message:"Error: "+ err
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Please provide email and password" });
  }
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(404).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      res.status(404).json({ success: false, error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      code: 200,
      token: "woikdlsd78dsdksl",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      code: 500,
      error: err.message,
    });
  }
};

exports.forgotPassword = (req, res, next) => {
  res.send("forgotPassword route");
};

exports.resetPassword = (req, res, next) => {
  res.send("reset Password route");
};
