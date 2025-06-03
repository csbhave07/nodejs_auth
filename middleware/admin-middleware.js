

const isadminUser = (req, res, next) => {
    if (req.userInfo.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'you are not an admin'
        })
    }
    next();
}

module.exports = isadminUser;