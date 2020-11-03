const router = require('express').Router();
const Review = require('../models/review');
const Product = require('../models/product');
const verifyToken = require('../middlewares/verify-token');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');

router.post(
  '/reviews/:productID',
  [verifyToken, upload.single('photo')],
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const review = new Review();
      review.headline = req.body.headline;
      review.body = req.body.body;
      review.rating = req.body.rating;
      review.photo = result.secure_url;
      review.user = req.decoded._id;
      review.productID = req.params.productID;

      await Product.update({ $push: { reviews: review._id } });
      const savedReview = await review.save();
      if (savedReview) {
        res.json({
          success: true,
          message: 'Succesfully Added Review',
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.get('/reviews/:productID', async (req, res) => {
  try {
    const productReviews = await Review.find({
      productID: req.params.productID,
    })
      .populate('user')
      .exec();

    res.json({
      success: true,
      reviews: productReviews,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
