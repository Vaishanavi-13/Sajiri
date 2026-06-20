const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller.simple');

// Public routes - no authentication needed
router.get('/', productCtrl.getProducts);
router.get('/featured', productCtrl.getFeatured);
router.get('/:id', productCtrl.getProduct);
router.post('/:id/like', productCtrl.likeProduct);

module.exports = router;
