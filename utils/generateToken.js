const jwt = require('jsonwebtoken');

const generateToken = (id, email, role) => {
    return jwt.sign({ userId: id, email, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

module.exports = generateToken;
