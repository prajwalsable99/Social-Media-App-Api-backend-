const express =require('express');
const cookieparser=require('cookie-parser');
require('dotenv').config({path:'config/config.env'})

const app=express();

//using middleware 
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

