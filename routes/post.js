const express=require("express");
const { Createpost, likeandUnlikePost, DeletePost, getPostsOfFollowing } = require("../controllers/post");
const { isAuth } = require("../middlewares/auth");

const router =express.Router();


router.route('/createpost').post(isAuth,Createpost);
router.route('/likeunlike/:id').get(isAuth,likeandUnlikePost);
router.route('/delete/:id').delete(isAuth,DeletePost);
router.route('/getposts').get(isAuth,getPostsOfFollowing);


module.exports=router;