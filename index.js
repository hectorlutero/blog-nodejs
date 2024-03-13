const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
require('./middlewares/passport-config');

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL || 'mongodb://root:root@localhost:27017/admin';
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/users', userRoutes);

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
