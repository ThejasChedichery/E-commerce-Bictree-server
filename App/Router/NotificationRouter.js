const express = require('express');
const { GetUserNotifications, MarkAsRead, GetAllNotifications } = require('../Controller/NotificationController');
const { Validation, RoleValidation } = require('../Middleware/validation');

const router = express.Router();

router.get('/user/:userId', Validation, GetUserNotifications);
router.put('/read/:id', Validation, MarkAsRead);
router.get('/', Validation, RoleValidation('admin'), GetAllNotifications);

module.exports = router;
