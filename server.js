const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes'); 
require('dotenv').config(); 
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Auth API ');
});

const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

module.exports = app; 
