// routes/authRoutes.js
const express = require('express');
const { authUser } = require('../../controllers/v1/User.Controller');
const router = express.Router();

router.post('/auth', authUser);

module.exports = router;
