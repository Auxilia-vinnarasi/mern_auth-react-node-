//Authentication piece of middlewares placed here...

const jwt=require("jsonwebtoken");
const User=require("../models/User");
const ErrorResponse=require("../utils/errorResponse");

exports.protect=async (req,res,next)=>{
    let token;

    //Authentication Bearer in Token:
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        //split()=>splits string into an array of substrings
        //Bearer   jwt
        //Bearer  58sffkdf8s08f09s80fsjlfjslfjls
        //(1st part of array)  (2nd part of Array)
        token=req.headers.authorization.split(" ")[1]
        //we got the token
     }
     //if there is no token in the headers
     if(!token){
        return next(new ErrorResponse("Not authorized to access this route",401))

     }
     //decode the token which we got
     try{
         const decoded=jwt.verify(token,process.env.JWT_SECRET)
         const user=await User.findById(decoded.id);
         req.user=user;
      //we want to say to the controllers to run the next piece of controllers to run..
         next();

     }
     catch(err){
      return next (new ErrorResponse("Not authorized to access this route",401))
     }
}

//after adding protect in routes u have to do postman
//Authorization Bearer login token
//content-type application/json and it shows u got access to the private data in the route

