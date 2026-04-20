const express = require("express");
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,      
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});
const bcrypt = require('bcryptjs');

/**@Swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *    requestBody:
 *      required: true
 *     content:
 *      application/json:
 *       schema:
 *       type: object
 *      properties:
 *      username:
 *      type: string
 *     password:
 *     type: string
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: Bad request
 * 500:
 * description: Server error
 * 
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')";
        
        db.query(query, [username, hashedPassword], (err) => {
            if (err) return res.status(400).json("Username already taken");
            res.status(201).json("Employee account created successfully!");
        });
    } catch (err) {
        res.status(500).json("Server error");
    }
});
module.exports = router;