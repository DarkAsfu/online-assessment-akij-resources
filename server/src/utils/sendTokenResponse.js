const { generateToken } = require("./generateToken");

const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

exports.sendTokenResponse = sendTokenResponse;