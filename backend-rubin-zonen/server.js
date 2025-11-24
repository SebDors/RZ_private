require('dotenv').config(); // Load environment variables from the start
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const db = require('./config/db'); // Import the database connection module
const diamantsRoutes = require('./routes/diamantsRoutes');
const usersRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const watchlistRoutes = require('./routes/watchlistRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const filtersRoutes = require('./routes/filtersRoutes');
const emailRoutes = require('./routes/emailRoutes');
const savedSearchRoutes = require('./routes/savedSearchRoutes');
const logRoutes = require('./routes/logRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
const { downloadAndProcessDiamonds } = require('./services/ftpService');
// API Documentation with Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the routes in the array
// TODO: Adjust allowed origins in production
const allowedOrigins = ['http://localhost:4173', 'http://localhost:5173','http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json()); // Middleware to parse JSON

// Test routes for the database (we will move or delete these later)
app.get('/', (req, res) => {
    res.send('Rubin & Zonen API under development!');
});

app.get('/test-db', async (req, res) => {
    try {
        const client = await db.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        res.status(200).json({
            message: 'Database connection successful!',
            currentTime: result.rows[0].now
        });
    } catch (error) {
        console.error('Error during database test:', error);
        res.status(500).json({
            message: 'Database connection failed.',
            error: error.message
        });
    }
});

// Schedule FTP download and processing of diamonds
// This cron job runs every 5 minutes.
cron.schedule('*/5 * * * *', () => {
    console.log('Running the scheduled job to download and process diamonds from FTP...');
    downloadAndProcessDiamonds();
});


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // OpenAPI specification
        info: {
            title: 'Rubin & Zonen API',
            version: '1.0.0',
            description: 'REST API documentation for the Rubin & Zonen project, developed with Node.js, Express, and PostgreSQL.',
            contact: {
                name: 'EPF Projets',
                url: 'https://www.epfprojets.com/',
                email: 'info@epfprojets.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server'
            },
            // Add other servers here (staging, production) if necessary
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    // Path to the files containing the JSDoc annotations for the API
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use routes
app.use('/api/diamants', diamantsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/filters', filtersRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/saved-searches', savedSearchRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/email-templates', emailTemplateRoutes);

// Handle not found routes (404)
app.use((req, res, next) => {
    res.status(404).send("Sorry, the requested resource was not found!");
});

// Global error handler (to be refined later)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.listen(port, () => {
    console.log(`API server started on port localhost:${port}`);
});