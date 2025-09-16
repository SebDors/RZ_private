require('dotenv').config(); // Charge les variables d'environnement du fichier .env

const { Pool } = require('pg');

// Récupération des variables d'environnement pour la connexion à la base de données
const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port_serv,
    // ssl: process.env.ssl === 'true' // Décommentez si vous utilisez SSL, assurez-vous que la variable est un string 'true'
});


pool.on('error', (err) => {
    console.error('Erreur inattendue sur la connexion au pool de base de données', err);
    process.exit(-1); // Quitte l'application en cas d'erreur critique
});

module.exports = pool;