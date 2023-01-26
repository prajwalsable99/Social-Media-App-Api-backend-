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

exports.likeandUnlikePost= async (req,res)=>{
    try {

        const post= await Post.findById(req.params.id);
        if(!post){
        
            return res.status(404).json({
                success:false,
                message:"post not found",
            })
        }

        if(post.likes.includes(req.user._id)){

            const index= post.likes.indexOf(req.user._id);
            post.likes.splice(index,1);
            await post.save();
            return res.status(200).json({
                success:true,
                message:"unliked",
            })

        }else{

            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({
                success:true,
                message:"liked",
            })

        }
        
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message,
            })
    }
}

exports.DeletePost= async (req,res)=>{
    try {

        const post= await Post.findById(req.params.id);
        if(!post){
        
            return res.status(404).json({
                success:false,
                message:"post not found",
            })
        }

        if(post.owner.toString()!==req.user._id.toString()){

           
            return res.status(401).json({
                success:true,
                message:"unauthorized",
            })

        }else{
            
            
            const user =await User.findById(req.user._id);
            const index=user.posts.indexOf(req.params.id);
            // console.log(index)
            user.posts.splice(index,1);
            await user.save()
            await post.remove();

            
            return res.status(200).json({
                success:true,
                message:"post deleted",
            })

        }
        
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message,
            })
    }
}

exports.getPostsOfFollowing = async (req,res)=>{


    try {
        const user= await User.findById(req.user._id);

        const posts =await Post.find(
            {
                owner:{ $in:user.following}
            }
        )
        return res.status(200).json({
            success:true,
            posts:posts,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}