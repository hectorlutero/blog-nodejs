const express = require('express');
const router = express.Router();
require('dotenv').config();

const userRoutes = require('./userRoutes.js'); // Import user-related routes

// const documentRoutes = require('./documentRoutes'); // Import document-related routes
// const { isAuthenticated } = require('../middlewares/authenticationMiddleware'); // Import authentication middleware

// User-related routes
router.use('/users', userRoutes);

// Document-related routes with authentication middleware
// router.use('/documents', isAuthenticated, documentRoutes);

module.exports = router;
