require("dotenv").config({path:"./config.env"})

const express=require("express");
const connectDB=require("./config/db");
const errorHandler=require("./middlewares/error");

//connect DB
connectDB();

const app=express();

//this is the middleware which is allows us to get the data from the body (ie) req.body
app.use(express.json());

app.use("/api/auth",require("./routes/auth"));
app.use("/api/private",require("./routes/private"));

//the middleware catch all the errors we passed to the next var
//Error Handler (should be last piece of middleware);
app.use(errorHandler);

const PORT=process.env.PORT || 5000;

//get request for checking server
app.get("/",(req,res)=>{
    res.send("App is working ....")
});




 const server=app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);
});

//for nicely done error im creating this
process.on("unhandledRejection",(err,promise)=>{
    console.log(`Logged Error:${err}`);
    server.close(()=>process.exit(1));
})