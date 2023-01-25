const express=require("express");
const { Createpost } = require("../controllers/post");
const { isAuth } = require("../middlewares/auth");

const router =express.Router();


router.route('/createpost').post(isAuth,Createpost);


module.exports=router;