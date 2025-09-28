const express = require('express');
const { Register, Login } = require('../Controller/AuthController');
const { LoginValidation } = require('../Middleware/validation');

const router = express.Router();

router.post('/register', Register);
router.post('/login', LoginValidation, Login);

module.exports = router;