const { sendEmail } = require('../middlewares/sendEmail');
const User = require('../models/User');
const crypto=require('crypto')

// create new user /sign up
exports.createUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        let newuser = await User.findOne({ email });

        if (newuser) {
            return res.status(400).json({
                success: false,
                message: "email already exists",
            })
        }

        newuser = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "sample_av_id",
                url: "sample_av_url"
            }
        });

        res.status(201).json({
            success: true,
            newuser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password").populate("posts");


        if (!user) {
            res.status(400).json({
                success: false,
                message: "user dont exist",
            })
            return;
        }

        const isCorrect = await user.checkPassword(password);

        if (!isCorrect) {
            res.status(400).json({
                success: false,
                message: "incorrect password",
            })

        }
        else {
            // create login token 
            const token = await user.createToken();
            // console.log(token)

            res.status(200).cookie("token", token, { expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), httpOnly: true }).json({
                success: true,
                token,
                user
            })
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.FollowUser = async (req, res) => {

    try {
        const to_follow_user = await User.findById(req.params.id);
        const curr_user = await User.findById(req.user._id);

        if (!to_follow_user) {
            return res.status(401).json({
                success: false,
                message: "user not found",
            })
        }


        if (curr_user.following.includes(to_follow_user._id)) {

            const ind_in_following = curr_user.following.indexOf(to_follow_user._id);
            const ind_in_follower = to_follow_user.followers.indexOf(curr_user._id);

            curr_user.following.splice(ind_in_following, 1);
            to_follow_user.followers.splice(ind_in_follower, 1);

            await curr_user.save();
            await to_follow_user.save();
            return res.status(200).json({
                success: true,
                message: "unfollowed successfully",
            })


        } else {
            curr_user.following.push(to_follow_user._id);
            to_follow_user.followers.push(curr_user._id);

            await curr_user.save();
            await to_follow_user.save();
            return res.status(200).json({
                success: true,
                message: "followed successfully",
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.Logout = async (req, res) => {

    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json(
            {
                success: true,
                message: "logged out successfully"
            }
        )

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

exports.UpdatePassword = async (req, res) => {

    try {

        const user = await User.findById(req.user._id).select("+password");
        const { oldpassword, newpassword } = req.body;
        if (!oldpassword || !newpassword) {
            return res.status(400).json({
                success: false,
                message: "please enter valid entries",
            })
        }

        const ismatch = await user.checkPassword(oldpassword);
        if (!ismatch) {
            return res.status(400).json({
                success: false,
                message: "old password incorrect",
            })

        }
        user.password = newpassword;
        await user.save()

        return res.status(200).json({
            success: true,
            message: "password changed successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }


}

exports.UpdateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email } = req.body;
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email
        }


        await user.save()

        return res.status(200).json({
            success: true,
            message: "profile changed successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

exports.getMyProfile = async (req, res) => {

    try {
        const profile = await User.findById(req.user._id).populate("posts");

        return res.status(200).json({
            success: true,
            profile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}


exports.getUserProfile = async (req, res) => {

    try {
        const profile = await User.findById(req.params.id).populate("posts");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            })
        }

        return res.status(200).json({
            success: true,
            profile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

exports.getAllUsers = async (req, res) => {

    try {
        const users = await User.find({});

        return res.status(200).json({
            success: true,
            users,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}


exports.forgotPassword = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            })
        }

        const resetPasswordToken =await user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.get(
            "host"
        )}/api/v1/user/resetpassword/${resetPasswordToken}`;

        const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Reset Password",
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: error.message,
            });
        }



    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
  
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token is invalid or has expired",
        });
      }
  
      user.password = req.body.password;
  
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Password Updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };