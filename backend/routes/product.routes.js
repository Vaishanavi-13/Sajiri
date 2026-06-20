const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const { verifyJWT, verifyOwner } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload.middleware');

router.post('/create', verifyJWT, verifyOwner, upload.array('images', 5), productCtrl.createProduct);
module.exports = router;
