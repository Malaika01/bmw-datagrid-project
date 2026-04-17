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

// routes
const carRoutes = require("./routes/cars");
app.use("/api/cars", carRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});
