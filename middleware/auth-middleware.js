const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1];

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access denied, Invalid token'
        })
    }

    // decode the token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedToken;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Access denied, Invalid token'
        })
    }
}

module.exports = authMiddleware;