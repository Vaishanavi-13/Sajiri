const express = require('express');
const router = express.Router();

const { 
    createProduct, 
    listProducts, 
    getProduct 
} = require('../controllers/productController');


router.post('/create', createProduct);

router.get('/', listProducts);

router.get('/:id', getProduct);


module.exports = router;