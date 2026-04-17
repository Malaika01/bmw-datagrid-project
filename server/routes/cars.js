const express = require("express");
const router = express.Router();

//Connecting to database
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '123456', 
    database: 'bmw_datagrid'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

router.get('/', (req, res) => {
    const sqlQuery = "SELECT * FROM cars";
    db.query(sqlQuery, (err, results) => {
        if (err){
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

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
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM cars WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err){
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Car with ID ${id} not found" });
        }
        else {  
            res.status(200).json({ message: `Car with ID ${id} deleted successfully.` });
        }

    });
});
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