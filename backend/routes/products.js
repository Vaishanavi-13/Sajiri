const express = require('express');
const router = express.Router();
const { createProduct, listProducts, getProduct } = require('../controllers/productController');

router.get('/', listProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);

module.exports = router;
