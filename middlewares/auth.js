const User=require('../models/User');
const jwt= require('jsonwebtoken');


exports.isAuth= async (req,res,next)=>{
       try {
        const {token}=req.cookies;
        if(!token){
           return res.status(401).json({
                // success:false,
                message:"please login first",
            })
            
        }else{

            const decode_token=await jwt.verify(token,process.env.SECRET);
            req.user=await User.findById(decode_token._id);
        }
        next();
        
       } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
       }

}