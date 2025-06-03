const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { decrypt } = require('dotenv');
const jwt = require('jsonwebtoken');

// register controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // check if the user is already exists in our database
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already exists with same username or email'
            });
        }

        // has user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user & save db
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        await newUser.save();

        if (newUser) {
            res.status(201).json({
                success: true,
                message: 'User Register successfully',
                data: newUser
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Register user failed',
            error
        })
    }
}

// login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // find current user exists on database
        const user = await User.findOne({ $or: [{ username }] });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // if the password is correct or not

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // if password is matched then create a token
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        });

        res.status(200).json({
            success: true,
            message: 'Logged In successfull',
            accessToken
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'login failed',
            error
        })
    }

}

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        // extract old & new password
        const { oldPassword, newPassword } = req.body;

        // find the current loggedIn user
        const user = await User.findById(userId);
        console.log(user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // if the whole password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'old password is not correct please try again'
            });
        }

        // hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // update user password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong',
            error
        })
    }
}

module.exports = { registerUser, loginUser, changePassword }