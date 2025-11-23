require('dotenv').config(); // Charge les variables d'environnement dès le début
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importe le module de connexion à la base de données
const diamantsRoutes = require('./routes/diamantsRoutes');
const usersRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const watchlistRoutes = require('./routes/watchlistRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const filtersRoutes = require('./routes/filtersRoutes');
const emailRoutes = require('./routes/emailRoutes');
const logRoutes = require('./routes/logRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
// Documentation API avec Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the routes in the array
// TODO : ajuster les origines autorisées en production
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

app.use(express.json()); // Middleware pour parser le JSON

// Routes de test de la base de données (nous les déplacerons plus tard ou les supprimerons)
app.get('/', (req, res) => {
    res.send('API Rubin & Zonen en cours de développement !');
});

app.get('/test-db', async (req, res) => {
    try {
        const client = await db.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        res.status(200).json({
            message: 'Connexion à la base de données réussie !',
            currentTime: result.rows[0].now
        });
    } catch (error) {
        console.error('Erreur lors du test de la base de données :', error);
        res.status(500).json({
            message: 'Échec de la connexion à la base de données.',
            error: error.message
        });
    }
});

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Spécification OpenAPI
        info: {
            title: 'API Rubin & Zonen',
            version: '1.0.0',
            description: 'Documentation de l\'API REST pour le projet Rubin & Zonen, développée avec Node.js, Express et PostgreSQL.',
            contact: {
                name: 'EPF Projets',
                url: 'https://www.epfprojets.com/',
                email: 'info@epfprojets.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement local'
            },
            // Ajoutez d'autres serveurs ici (staging, production) si nécessaire
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
    // Chemin vers les fichiers contenant les annotations JSDoc pour l'API
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Utilisation des routes
app.use('/api/diamants', diamantsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/filters', filtersRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/email-templates', emailTemplateRoutes);

// Gestion des routes non trouvées (404)
app.use((req, res, next) => {
    res.status(404).send("Désolé, la ressource demandée n'a pas été trouvée !");
});

// Gestionnaire d'erreurs global (à affiner plus tard)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});


app.listen(port, () => {
    console.log(`Serveur API démarré sur le port localhost:${port}`);
});