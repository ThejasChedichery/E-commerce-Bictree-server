const express = require('express');
const { CreateProduct, GetAllProducts, EditProduct, GetProductById, DeleteProduct } = require('../Controller/ProductController');
const { Validation, RoleValidation } = require('../Middleware/validation');

const router = express.Router();

router.post('/', Validation, RoleValidation('admin'), CreateProduct);
router.get('/', GetAllProducts);
router.get('/:id', GetProductById);
router.put('/:id', Validation, RoleValidation('admin'), EditProduct);
router.delete('/:id', Validation, RoleValidation('admin'), DeleteProduct);

module.exports = router;