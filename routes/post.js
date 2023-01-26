const express=require("express");
const { Createpost, likeandUnlikePost, DeletePost, getPostsOfFollowing, updatePost, addComment } = require("../controllers/post");
const { isAuth } = require("../middlewares/auth");

const router =express.Router();


router.route('/createpost').post(isAuth,Createpost);
router.route('/likeunlike/:id').get(isAuth,likeandUnlikePost);
router.route('/delete/:id').delete(isAuth,DeletePost);
router.route('/update/:id').put(isAuth,updatePost)
router.route('/getposts').get(isAuth,getPostsOfFollowing);
router.route('/addcomment/:id').put(isAuth,addComment);


module.exports=router;