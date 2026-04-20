const express = require("express");
const router = express.Router();

//Connecting to database
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
/**
 * @swagger
 * /:
 *   post:
 *     summary: Add a new car
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Brand:
 *                 type: string
 *               Model:
 *                 type: string
 *               AccelSec:
 *                 type: number
 *               TopSpeed_KmH:
 *                 type: number
 *               Range_Km:
 *                 type: number
 *               Efficiency_WhKm:
 *                 type: number
 *               FastCharge_KmH:
 *                 type: number
 *               RapidCharge:
 *                 type: string
 *               PowerTrain:
 *                 type: string
 *               PlugType:
 *                 type: string
 *               BodyStyle:
 *                 type: string
 *               Segment:
 *                 type: string
 *               Seats:
 *                 type: number
 *               PriceEuro:
 *                 type: number
 *               Date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Car added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => {
    const { 
        Brand, Model, AccelSec, TopSpeed_KmH, Range_Km, 
        Efficiency_WhKm, FastCharge_KmH, RapidCharge, 
        PowerTrain, PlugType, BodyStyle, Segment, Seats, PriceEuro, Date 
    } = req.body;

    if (!Brand || !Model || !PriceEuro) {
        return res.status(400).json("Brand, Model, and Price are mandatory.");
    }

    const query = `
        INSERT INTO cars (
            Brand, Model, AccelSec, TopSpeed_KmH, Range_Km, 
            Efficiency_WhKm, FastCharge_KmH, RapidCharge, 
            PowerTrain, PlugType, BodyStyle, Segment, Seats, PriceEuro, Date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        Brand, Model, AccelSec || 0, TopSpeed_KmH || 0, Range_Km || 0,
        Efficiency_WhKm || 0, FastCharge_KmH || 0, RapidCharge || 'No',
        PowerTrain || 'RWD', PlugType || 'Type 2', BodyStyle || 'Sedan',
        Segment || 'C', Seats || 5, PriceEuro, Date || new Date().toISOString().slice(0, 10)
    ];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json("Database Error: " + err.message);
        res.status(201).json({ message: "Vehicle added!", id: result.insertId });
    });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all cars
 *     responses:
 *       200:
 *         description: A list of all cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', (req, res) => {
    const sqlQuery = "SELECT * FROM cars";
    db.query(sqlQuery, (err, results) => {
        if (err){
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/cars/search:
 *   get:
 *     summary: Search for cars by brand or model
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term
 *     responses:
 *       200:
 *         description: A list of cars matching the search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

router.get("/search", (req, res) => {
    const search_term = req.query.q;

    console.log("Search API called:", req.query);

    if (!search_term) {
        return res.status(400).json({ message: "No search term provided" });
    }

    const query = `
        SELECT * FROM cars
        WHERE LOWER(brand) LIKE LOWER(?) OR LOWER(model) LIKE LOWER(?)
    `;

    const searchValue = `%${search_term}%`;

    db.query(query, [searchValue, searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No cars found matching search" });
        }

        res.json(results);
    });
});

/**
 * @swagger
 * /api/cars/filter:
 *   get:
 *     summary: Filter cars by various criteria
 *     parameters:
 *       - in: query
 *         name: brand_equals
 *         schema:
 *           type: string
 *         description: Filter by exact brand match
 *       - in: query
 *         name: model_equals
 *         schema:
 *           type: string
 *         description: Filter by exact model match
 *       - in: query
 *         name: brand_contains
 *         schema:
 *           type: string
 *         description: Filter by brand containing the given string
 *       - in: query
 *         name: model_contains
 *         schema:
 *           type: string
 *         description: Filter by model containing the given string
 *       - in: query
 *         name: price_gt
 *         schema:
 *           type: number
 *         description: Filter by price greater than the given value
 *       - in: query
 *         name: price_lt
 *         schema:
 *           type: number
 *         description: Filter by price less than the given value
 *     responses:
 *       200:
 *         description: A list of cars matching the search
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/filter", (req, res) => {

    const { 
        brand_equals,
        model_equals,
        brand_contains,
        model_contains,
        price_gt,
        price_lt
    } = req.query;

    let query = "SELECT * FROM cars";
    let conditions = [];
    let params = [];
    console.log("SQL:", query);
    console.log("PARAMS:", params);

    
    if (brand_equals) {
        conditions.push("LOWER(TRIM(Brand)) = LOWER(TRIM(?))");
        params.push(brand_equals);
    }

    if (model_equals) {
        conditions.push("LOWER(TRIM(Model)) = LOWER(TRIM(?))");
        params.push(model_equals);
    }

    if (brand_contains) {
        conditions.push("LOWER(TRIM(Brand)) LIKE LOWER(?)");
        params.push(`%${brand_contains}%`);
    }

    if (model_contains) {
        conditions.push("LOWER(TRIM(Model)) LIKE LOWER(?)");
        params.push(`%${model_contains}%`);
    }
    if (price_gt) {
        conditions.push("PriceEuro > ?");
        params.push(Number(price_gt));
    }

    if (price_lt) {
        conditions.push("PriceEuro < ?");
        params.push(Number(price_lt));
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No cars found" });
        }

        res.json(results);
    });
});


/**
 * @swagger
 * /api/cars/delete/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the car to delete
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM cars WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            // FIXED: Used backticks (`) for string interpolation
            return res.status(404).json({ message: `Car with ID ${id} not found` });
        } else {  
            // FIXED: Used backticks (`) for string interpolation
            res.status(200).json({ message: `Car with ID ${id} deleted successfully.` });
        }
    });
});

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the car to retrieve
 *     responses:
 *       200:
 *         description: The car with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM cars WHERE id = ?";
    
    db.query(query, [id], (err, results) => {
        if (err){
            return res.status(500).json({ error: err.message });
        };
        
        res.status(200).json(results[0]);
    });
});

module.exports = router;