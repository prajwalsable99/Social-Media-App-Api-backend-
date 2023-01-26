const express=require("express");
const { createUser,Login, FollowUser, Logout} = require("../controllers/user");
const { isAuth } = require("../middlewares/auth");
const router =express.Router();


router.route('/create').post(createUser);
router.route('/login').post(Login);
router.route('/logout').get(Logout);
router.route('/follow/:id').get(isAuth,FollowUser)
module.exports=router;