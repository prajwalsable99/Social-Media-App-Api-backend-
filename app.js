const express =require('express');
const cookieparser=require('cookie-parser');
const cors=require("cors");
require('dotenv').config({path:'config/config.env'})

const app=express();

//using middleware 
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())

// importing routes
const PostRoutes=require('./routes/post');
const UserRoutes=require('./routes/user');

// using routes
app.use("/api/v1/post",PostRoutes);
app.use('/api/v1/user',UserRoutes);


module.exports=app;

