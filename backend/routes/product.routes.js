const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');
const { protect, verifyOwner } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

// Public routes
router.get('/', productCtrl.getProducts);
router.get('/featured', productCtrl.getFeatured);
router.get('/pending', protect, admin, productCtrl.getPendingProducts);

// Authenticated product actions
// Use RESTful POST /api/products for creation to avoid conflicts with GET /api/products/:id
router.post('/', protect, verifyOwner, upload.array('images'), productCtrl.createProduct);
router.get('/my-products', protect, verifyOwner, productCtrl.getMyProducts);

// Like route requires authentication
router.post('/:id/like', protect, productCtrl.likeProduct);

// Admin-only moderation
router.put('/:id/approve', protect, admin, productCtrl.approveProduct);
router.put('/:id/reject', protect, admin, productCtrl.rejectProduct);

router.get('/:id', productCtrl.getProduct);

module.exports = router;
