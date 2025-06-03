
const uploadToCloudinary = require('../helpers/cloudinary-helper');
const Image = require('../models/Image');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const imageController = async (req, res) => {
    try {
        // if file is missing in req object
        if (!req.file) {
            res.status(500).json({
                success: false,
                message: 'file is missing'
            })
        }

        // upload to cloudinary

        const { publicId, url } = await uploadToCloudinary(req.file.path);
        console.log('cloud', publicId, url);
        // store the url & publicId alogin with user id in db
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })
        await newlyUploadedImage.save();

        // delete file from local folder
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'file uploaded successfully',
            image: newlyUploadedImage,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'something went wrong',
            error
        })
    }
}

const fetchImagesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {}
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages,
            totalImages,
            data: images,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'something went wrong',
            error
        })
    }
}

const deleteImagesController = async (req, res) => {
    try {
        const getCurrectImageIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrectImageIdOfImageToBeDeleted);
        if (!image) {
            res.status(404).json({
                success: false,
                message: 'Image not found',
            })
        }

        // check if this image is uploaded by the current user who is trying to delet this image
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image',
            })
        }

        // delete this image first from your cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        // delete this image from mongoDB
        await Image.findByIdAndUpdate(getCurrectImageIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: 'Image deleted succssfully',
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'something went wrong',
            error
        })
    }
}

module.exports = { imageController, fetchImagesController, deleteImagesController };