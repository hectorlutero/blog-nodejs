const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const isAuthenticated = require('../middlewares/authenticationMiddleware');

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.post('/logout', UserController.logout);

router.get('/profile', isAuthenticated, UserController.getCurrentUser);

router.post('/profile/update', isAuthenticated, UserController.updateUserProfile);

module.exports = router;
