const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.post('/', protect, orderCtrl.createOrder);
router.post('/verify-payment', protect, orderCtrl.verifyPayment);
router.get('/my-orders', protect, orderCtrl.getMyOrders);
router.get('/:id', protect, orderCtrl.getOrderById);
router.get('/', protect, admin, orderCtrl.getAllOrders);
router.put('/:id/status', protect, admin, orderCtrl.updateStatus);
router.put('/:id/accept', protect, admin, orderCtrl.acceptOrder);
router.put('/:id/reject', protect, admin, orderCtrl.rejectOrder);
router.put('/:id/deliver', protect, admin, orderCtrl.deliverOrder);

module.exports = router;
