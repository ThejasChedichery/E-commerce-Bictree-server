const express = require('express');
const { PlaceOrder, UpdateOrderStatus, GetUserOrders, GetAllOrders } = require('../Controller/OrderController');
const { Validation, RoleValidation } = require('../Middleware/validation');

const router = express.Router();

router.post('/', Validation, PlaceOrder);
router.put('/:id/status', Validation, RoleValidation('admin'), UpdateOrderStatus);
router.get('/user/:userId', Validation, GetUserOrders);
router.get('/', Validation, RoleValidation('admin'), GetAllOrders);

module.exports = router;