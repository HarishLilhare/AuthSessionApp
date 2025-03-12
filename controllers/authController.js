const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const crypto = require('crypto');
require('dotenv').config();

// Register 
const registerUser = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });

        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hash], (err) => {
            if (err) return res.status(500).json({ message: 'User already exists' });
            res.status(201).json({ message: 'User registered' });
        });
    });
};

// Login user
const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', token });
        });
    });
};

// Forgot password
const forgotPassword = (req, res) => {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = Date.now() + 3600000; 

    db.run(`UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`, [token, expiry, email], (err) => {
        if (err) return res.status(500).json({ message: 'Email not found' });
        res.json({ message: 'Reset link sent to email', token });
    });
};

// Reset password
const resetPassword = (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;


    db.get(`SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?`, [token, Date.now()], (err, user) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
                console.error("Password Hashing Error:", err);
                return res.status(500).json({ message: "Error hashing password" });
            }

    
            db.run(`UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?`, [hash, user.email], (err) => {
                if (err) {
                    console.error("Database Update Error:", err);
                    return res.status(500).json({ message: "Failed to update password" });
                }
                
                res.json({ message: "Password reset successful" });
            });
        });
    });
};
module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
