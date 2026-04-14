// basic backend API server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());          
app.use(express.json());  

app.get('/', (req, res) => {
    res.send('BMW Electric Car API is running...');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});


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

app.get('/api/cars', (req, res) => {
    const sqlQuery = "SELECT * FROM cars";
    db.query(sqlQuery, (err, results) => {
        if (err){
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM cars WHERE id = ?";
    
    db.query(query, [id], (err, results) => {
        if (err){
            return res.status(500).json({ error: err.message });
        };
        
        res.status(200).json(results[0]);
    });
});

app.delete('/api/cars/:id', (req, res) => {
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
