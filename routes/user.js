const express=require("express");
const { createUser,Login, FollowUser, Logout, UpdateProfile, UpdatePassword, getUserProfile, getMyProfile, getAllUsers} = require("../controllers/user");
const { isAuth } = require("../middlewares/auth");
const router =express.Router();


router.route('/create').post(createUser);
router.route('/login').post(Login);
router.route('/logout').get(Logout);
router.route('/follow/:id').get(isAuth,FollowUser)
router.route('/updatepassword').put(isAuth,UpdatePassword)
router.route('/updateprofile').put(isAuth,UpdateProfile)
router.route('/myprofile').get(isAuth,getMyProfile);
router.route('/profile/:id').get(isAuth,getUserProfile);
router.route('/allusers').get(isAuth,getAllUsers)
module.exports=router;