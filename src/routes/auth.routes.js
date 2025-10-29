const express = require('express');
const router = express.Router();
// const userRoutes = require('./routes/user.routes.js');
const authController = require('../controllers/auth.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.post('/private/signup', authController.signUp);
router.post('/private/signin', authController.signIn);
router.get("/private/logout", authMiddleware, authController.logout);
router.get('/private/profile', authMiddleware, authController.profile);
router.post('/private/forget/password', authController.forgetPassword);

module.exports = router;