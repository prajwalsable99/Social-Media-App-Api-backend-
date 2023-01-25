const Post=require('../models/Post')
const User=require('../models/User')
exports.Createpost=async(req,res)=>{
        try {
            // console.log("here")
            const newPostdata={
                caption:req.body.caption,
                image:{
                    public_id:"sample_post_id",
                    url:"sample_post_url"
                },
                owner:req.user._id,

            };

            const newPost= await Post.create(newPostdata);

            const user=await User.findById(req.user._id);
            user.posts.push(newPost._id);
            await user.save();
            
            res.status(201).json({
                success:true,
                post:newPost,
            })

            

        } catch (error) {
            
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
}