const express = require('express');
const authMiddleWare = require('../middleware/auth-middleware');
const adminMiddleWare = require('../middleware/admin-middleware');
const uploadMiddleWare = require('../middleware/upload-middleware');
const { imageController, fetchImagesController, deleteImagesController } = require('../controllers/image-controller');

const router = express.Router();

// upload the image
router.post('/upload', authMiddleWare, adminMiddleWare, uploadMiddleWare.single('image'), imageController);

router.get('/get', authMiddleWare, fetchImagesController);

router.delete('/:id', authMiddleWare, adminMiddleWare, deleteImagesController);

module.exports = router;