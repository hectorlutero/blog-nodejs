const User = require('../models/user'); // Import the User model
const bcrypt = require('bcryptjs'); // For password hashing and verification
const jwt = require('jsonwebtoken'); // For generating JWT tokens

const UserController = {
    // Register a new user
    register: async (req, res) => {
        try {

            const { username, email, password } = req.body

            if (!req.body) {
                return res.status(400).json({ message: 'Invalid request body' });
            }

            try {
                // Check for empty fields
                if (!username || !email || !password) {
                    return res.status(400).json({ message: 'Please provide all required fields' });
                }

                // Check for invalid email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Invalid email address' });
                }

                // Check for weak password
                if (password.length < 6) {
                    return res.status(400).json({ message: 'Password should be at least 6 characters long' });
                }

                // Check if the email or username already exists in the database
                const existingUser = await User.findOne({ $or: [{ email }, { username }] });
                if (existingUser) {
                    return res.status(409).json({ message: 'Email or username already exists' });
                }

                // Create a new user document
                const newUser = new User({ username, email, password });

                // Save the user to the database
                await newUser.save();

                // Generate a JWT token
                const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Return the newly created user object and the JWT token
                res.status(201).json({ message: 'User registered successfully', user: newUser, token });
            } catch (error) {
                console.error('Error registering user:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },



    // Authenticate a user
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Find the user by email
            const user = await User.findOne({ email });

            // If user not found or password doesn't match, return error
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Return the JWT token
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


    // Log out the currently authenticated user
    logout: async (req, res) => {
        try {
            // Clear the JWT token from the client-side
            res.clearCookie('jwt');

            // Return a success message
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Get the currently authenticated user's information
    getCurrentUser: async (req, res) => {
        try {
            // Retrieve the current user's ID from the request object
            const userId = req.user.userId;

            // Find the user by ID and select only the necessary fields (e.g., username and email)
            const user = await User.findById(userId).select('username email');

            // If user not found, return error
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Return the user object
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error retrieving current user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Update user profile information
    updateUserProfile: async (req, res) => {
        try {

            if (!req.body) {
                return res.status(400).json({ message: 'Invalid request body' });
            }

            const { username, password } = req.body
            // Check for weak password
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password should be at least 6 characters long' });
            }

            const updatedUser = await User.findById(req.user.userId)

            updatedUser.username = username

            updatedUser.password = password

            await updatedUser.save()

            res.status(200).json({ message: 'User successfully updated', user: updatedUser });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = UserController;
