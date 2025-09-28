const express = require('express');
const { CreateCategory, GetAllCategories, GetCategoryById, EditCategory, DeleteCategory } = require('../Controller/CategoryController');
const { Validation, RoleValidation } = require('../Middleware/validation');

const router = express.Router();

router.post('/', Validation, RoleValidation('admin'), CreateCategory);
router.get('/', GetAllCategories);
router.get('/:id', GetCategoryById);
router.put('/:id', Validation, RoleValidation('admin'), EditCategory);
router.delete('/:id', Validation, RoleValidation('admin'), DeleteCategory);

module.exports = router;