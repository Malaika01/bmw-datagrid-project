const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

//Swagger setup for API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BMW Car Inventory API',
      version: '1.0.0',
      description: 'API documentation for the BMW IT Internship Aptitude Test',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

//Express App setup
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());    //Enable CORS for all routes      
app.use(express.json());  //JSON body parsing middleware

app.get('/', (req, res) => {
    res.send('Data Grid Server is running');
});

// routes
const authRoutes = require("./routes/auth"); 
app.use("/api", authRoutes);

const registerRoutes = require("./routes/register"); 
app.use("/api", registerRoutes);

const carRoutes = require("./routes/cars");
app.use("/api/cars", carRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});
