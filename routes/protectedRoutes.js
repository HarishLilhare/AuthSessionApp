const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    jwt.verify(actualToken, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

// Protected route
router.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome to the dashboard, ${req.user.email}!`, user: req.user });
});

module.exports = router;
