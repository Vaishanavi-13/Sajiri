const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', productCtrl.getProducts);
router.get('/featured', productCtrl.getFeatured);
router.get('/:id', productCtrl.getProduct);
router.post('/', protect, upload.array('images', 5), productCtrl.createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), productCtrl.updateProduct);
router.delete('/:id', protect, admin, productCtrl.deleteProduct);

module.exports = router;
