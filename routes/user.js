const express=require("express");
const { createUser,Login} = require("../controllers/user");

const router =express.Router();


router.route('/create').post(createUser);
router.route('/login').post(Login);
module.exports=router;