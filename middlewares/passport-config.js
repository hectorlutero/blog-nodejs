const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Import the User model

// Local Strategy: Username and Password
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // Find the user by email
            const user = await User.findOne({ email });

            // If user not found or password doesn't match, return error
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            // If user is found and password is correct, return user
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
