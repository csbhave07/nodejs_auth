const multer = require('multer');
const path = require('path');

// set our multer storage
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
});

// file filter function
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(null, new Error('Please upload only image'))
    }
}

// multer middleware
module.exports = multer({
    storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } // provided file size 
});