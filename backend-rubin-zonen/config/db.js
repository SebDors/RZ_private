require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const { Pool } = require('pg');

// Récupération des variables d'environnement pour la connexion à la base de données
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.PORT_SERV,
    // ssl: process.env.SSL === 'true' // Décommentez si vous utilisez SSL, assurez-vous que la variable est un string 'true'
});


pool.on('error', (err) => {
    console.error('Erreur inattendue sur la connexion au pool de base de données', err);
    process.exit(-1); // Quitte l'application en cas d'erreur critique
});

module.exports = pool;