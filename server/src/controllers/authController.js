const User = require('../models/User');
const { sendTokenResponse } = require('../utils/sendTokenResponse');


exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'User already exists'
                });
        }
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'candidate'
        });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Please enter email and password'
                });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Invalid credentials'
                });
        }
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Invalid credentials'
                });
        }
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
}

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(
            {
                success: true,
                data: user,
            });
    } catch (error) {
        next(error);
    }
}
