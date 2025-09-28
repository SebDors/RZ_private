require('dotenv').config(); // Charge les variables d'environnement dès le début
const express = require('express');
const db = require('./config/db'); // Importe le module de connexion à la base de données
const diamantsRoutes = require('./routes/diamantsRoutes');
const usersRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const watchlistRoutes = require('./routes/watchlistRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();
const port = process.env.PORT || 3000;

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

// Utilisation des routes
app.use('/api/diamants', diamantsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/quotes', quoteRoutes);

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
    console.log(`Serveur API démarré sur le port ${port}`);
    console.log('Tentative de connexion à la base de données...');
});