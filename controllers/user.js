const User=require('../models/User');



// create new user /sign up
exports.createUser=async(req,res)=>{

    try {
        const {name,email,password}=req.body;
        let newuser = await User.findOne({email});

        if(newuser){
            return res.status(400).json({
                success:false,
                message:"email already exists",
            })
        }

        newuser =await User.create ({
            name,
            email,
            password,
            avatar:{
                public_id:"sample_av_id",
                url:"sample_av_url"
            }
        });

        res.status(201).json({
            success:true,
            newuser
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


exports.Login=async(req,res)=>{
        try {
            const {email,password}=req.body;
            const user=await User.findOne({email}).select("+password");
            

            if(!user){
                res.status(400).json({
                    success:false,
                    message:"user dont exist",
                })
                return;                
            }

            const isCorrect =await user.checkPassword(password);
           
            if(!isCorrect){
                 res.status(400).json({
                    success:false,
                    message:"incorrect password",
                })
                
            }
            else{
            // create login token 
            const token =await user.createToken();
            // console.log(token)

            res.status(200).cookie("token",token, {expires:new Date(Date.now()+ (30*24*60*60*1000)),httpOnly:true}).json({
                success:true,
                token,
                user
            })
        }
        

        } catch (error) {
            res.status(500).json({
                success:false,
                message:error.message,
            })
        }
}