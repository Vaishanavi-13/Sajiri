const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, cartCtrl.getCart);
router.post('/add', protect, cartCtrl.addItem);
router.put('/update', protect, cartCtrl.updateItem);
router.delete('/remove/:productId', protect, cartCtrl.removeItem);
router.delete('/clear', protect, cartCtrl.clearCart);

module.exports = router;
