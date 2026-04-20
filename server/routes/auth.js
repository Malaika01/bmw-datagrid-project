const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = process.env.JWT_SECRET;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,      
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *    responses:
 *    201:
 *     description: User registered successfully
 *    400:
 *     description: Bad request
 *    500:
 *     description: Server error
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json("Username and password are required");
    }

    try {
        const hashedPW = await bcrypt.hash(password, 10);
        
        const query = "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')";
        
        db.query(query, [username, hashedPW], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json("Username already taken");
                return res.status(500).json("Database error");
            }
            res.status(201).json({ message: "Employee account registered successfully" });
        });
    } catch (error) {
        res.status(500).json("Server error during registration");
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *    responses:
 *    201:
 *     description: User logged in successfully
 *    400:
 *     description: Bad request 
 *    500:
 *     description: Server error
 */
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 
});
router.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json("Username and password are required");
    }
    try {
        const [results] = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);{
        
        const user = results[0];
        const validPW = await bcrypt.compare(password, user.password);
        
        if (!validPW){
            return res.status(401).json("Invalid username or password");
        }

        //Check if role is valid before signing token
        if (!user.role || !['user', 'admin'].includes(user.role)) {
            return res.status(500).json("Invalid user role");
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        

        res.json({ 
            token, 
            role: user.role, 
            username: user.username 
        });
    }
        } catch (error) {
                res.status(500).json("Server error during login")
        }; 
});

/**
 * @swagger
 * /google-login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *    responses:
 *    201:
 *     description: User logged in successfully
 *    400:
 *     description: Bad request 
 *    500:
 *     description: Server error
 */
router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        db.query("SELECT * FROM users WHERE username = ?", [email], (err, results) => {
            if (results.length > 0) {
                const user = results[0];
                res.json({ token, role: user.role, username: user.username });
            } else {
                db.query("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')", 
                [email, 'google-auth-no-password'], (err) => {
                    res.json({ token, role: 'user', username: email });
                });
            }
        });
    } 
    catch (error) 
    {
        res.status(401).json("Invalid Google Token");
    }
});

module.exports = router;