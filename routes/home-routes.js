const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {
    const { userId, username, role, email } = req.userInfo;
    res.json({
        message: 'home page',
        data: {
            _id: userId,
            username,
            role,
            email
        }
    })
})

module.exports = router;