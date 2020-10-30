const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');

const Product = require('../models/product');

//POST request - create a new product
router.post('/products', upload.single('photo'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const product = new Product();
    product.title = req.body.title;
    product.description = req.body.description;
    product.photo = result.secure_url;
    product.stockQuantity = req.body.stockQuantity;

    await product.save();
    res.json({
      status: true,
      message: 'Successfuly saved',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//GET request - get all products

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//GET request - get a single product

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    res.json({
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//PUT request - Update a single product

router.put('/products/:id', upload.single('photo'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          category: req.body.categoryID,
          photo: result.secure_url,
          description: req.body.description,
          owner: req.body.ownerID,
        },
      },
      { upsert: true }
    );

    res.json({
      success: true,
      updateProduct: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//DELETE request - delete a single product
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
    });
    if (deletedProduct) {
      res.json({
        status: true,
        message: 'Successfully deleted',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
