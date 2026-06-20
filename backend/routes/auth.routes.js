const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/logout', protect, authCtrl.logout);
router.post('/refresh-token', authCtrl.refreshToken);

// Owner login may use the same endpoint as regular login but is controlled by SERVER-side owner credentials.
// No separate owner registration route is exposed.

module.exports = router;
