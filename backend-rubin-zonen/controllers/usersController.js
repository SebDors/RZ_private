const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Importe bcryptjs pour le hachage des mots de passe

// Logique pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const client = await db.connect();
        // Ne pas sélectionner le mot de passe dans les résultats (sécurité)
        const result = await client.query('SELECT * FROM users');
        client.release();

        if (req.header.origin){
            const origin = req.header.origin;
            res.setHeader('Access-Control-Allow-Origin', origin);
            console.log("CORS for origin: " + origin);
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des users. Error: ', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des users.' });
    }
};

// Logique pour récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await db.connect();
        // Ne pas sélectionner le mot de passe (sécurité)
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User non trouvé.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Erreur lors de la récupération du user ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du user.' });
    }
};

// Fonction pour créer un nouvel utilisateur (utilisation administrative, mot de passe requis)
exports.createUser = async (req, res) => {
    const {
        email, password, prefix, first_name, last_name, phone_number,
        designation, seller, company_name, company_owner, company_type, company_email,
        company_address, company_city, company_country, company_zip_code, id_document_url,
        business_registration_url, how_found_us, is_active
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
    }

    try {
        const salt = await bcrypt.genSalt(10); // Génère un sel avec 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt); // Hashe le mot de passe

        const client = await db.connect();
        const queryText = `
            INSERT INTO users (
                
                email, password, prefix, first_name, last_name, phone_number, designation, seller, 
                company_name, company_owner, company_type, company_email, company_address, company_city, 
                company_country, company_zip_code, id_document_url, business_registration_url, how_found_us, is_active

            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            ) RETURNING id, email, is_admin, is_active, created_at;
        `;
        const values = [
            email, hashedPassword, prefix, first_name, last_name, phone_number,
            designation, seller, company_name, company_owner, company_type, company_email,
            company_address, company_city, company_country, company_zip_code, id_document_url,
            business_registration_url, how_found_us, is_active
        ];
        const result = await client.query(queryText, values);
        client.release();

        res.status(201).json({
            message: 'User créé avec succès.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        if (error.code === '23505') { // Code pour violation de contrainte unique (email existe déjà)
            return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
        }
        res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur.' });
    }
};

// Fonction pour mettre à jour un utilisateur existant
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    // Colonnes autorisées à être mises à jour
    const allowedColumns = [
        'email', 'password', 'prefix', 'first_name', 'last_name', 'phone_number',
        'designation', 'seller', 'company_name', 'company_owner', 'company_type', 'company_email',
        'company_address', 'company_city', 'company_country', 'company_zip_code', 'id_document_url',
        'business_registration_url', 'how_found_us', 'is_admin', 'is_active'
    ];

    for (const key of allowedColumns) {
        if (updates[key] !== undefined) { // Vérifie si le champ est présent dans la requête
            if (key === 'password' && updates[key]) {
                // Hasher le nouveau mot de passe si fourni
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(updates[key], salt);
                setClauses.push(`${key} = $${paramIndex++}`);
                values.push(hashedPassword);
            } else {
                setClauses.push(`${key} = $${paramIndex++}`);
                values.push(updates[key]);
            }
        }
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ message: 'Aucun champ valide fourni pour la mise à jour.' });
    }

    values.push(id); // Ajoute l'ID de l'utilisateur pour la clause WHERE

    const queryText = `
        UPDATE users
        SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramIndex}
        RETURNING id, email, is_admin, is_active, updated_at;
    `;

    try {
        const client = await db.connect();
        const result = await client.query(queryText, values);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User non trouvé pour la mise à jour.' });
        }

        res.status(200).json({
            message: 'User mis à jour avec succès.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'utilisateur ${id} :`, error);
        if (error.code === '23505') { // Conflit d'email si l'email mis à jour existe déjà
            return res.status(409).json({ message: 'L\'email fourni est déjà utilisé.' });
        }
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'utilisateur.' });
    }
};

// Fonction pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await db.connect();
        const queryText = 'DELETE FROM users WHERE id = $1 RETURNING id, email;';
        const result = await client.query(queryText, [id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User non trouvé pour la suppression.' });
        }

        res.status(200).json({ message: `User avec l'ID ${id} et l'email ${result.rows[0].email} supprimé avec succès.` });
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'utilisateur.' });
    }
};

// Logique pour récupérer le profil de l'utilisateur connecté
exports.getConnectedUserProfile = async (req, res) => {
    const userId = req.user.id; // L'ID de l'utilisateur est attaché par le middleware d'authentification
    try {
        const client = await db.connect();
        const result = await client.query('SELECT id, email, prefix, first_name, last_name, phone_number, designation, seller, company_name, company_owner, company_type, company_email, company_address, company_city, company_country, company_zip_code, id_document_url, business_registration_url, how_found_us, is_admin, is_active, created_at, updated_at FROM users WHERE id = $1', [userId]);
        client.release();

        if (result.rows.length === 0) {
            // Ceci ne devrait pas arriver si le token est valide et l'utilisateur existe
            return res.status(404).json({ message: 'Profil utilisateur non trouvé.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Erreur lors de la récupération du profil utilisateur ${userId} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil.' });
    }
};

// Logique pour mettre à jour le profil de l'utilisateur connecté
exports.updateConnectedUserProfile = async (req, res) => {
    const userId = req.user.id; // L'ID de l'utilisateur est attaché par le middleware
    const updates = req.body;

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    // Colonnes que l'utilisateur PEUT mettre à jour lui-même
    const allowedSelfUpdateColumns = [
        'prefix', 'first_name', 'last_name', 'phone_number',
        'designation', 'seller', 'company_name', 'company_owner', 'company_type', 'company_email',
        'company_address', 'company_city', 'company_country', 'company_zip_code', 'id_document_url',
        'business_registration_url', 'how_found_us', 'password' // Permettre le changement de mot de passe
    ];

    for (const key of allowedSelfUpdateColumns) {
        if (updates[key] !== undefined) {
            if (key === 'password' && updates[key]) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(updates[key], salt);
                setClauses.push(`${key} = $${paramIndex++}`);
                values.push(hashedPassword);
            } else {
                setClauses.push(`${key} = $${paramIndex++}`);
                values.push(updates[key]);
            }
        }
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ message: 'Aucun champ valide fourni pour la mise à jour du profil.' });
    }

    values.push(userId); // Le dernier paramètre est l'ID de l'utilisateur pour la clause WHERE

    const queryText = `
        UPDATE users
        SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramIndex}
        RETURNING id, email, is_admin, is_active, updated_at;
    `;

    try {
        const client = await db.connect();
        const result = await client.query(queryText, values);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profil utilisateur non trouvé pour la mise à jour.' });
        }

        res.status(200).json({
            message: 'Profil mis à jour avec succès.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du profil utilisateur ${userId} :`, error);
        if (error.code === '23505') { // Conflit d'email si l'email mis à jour existe déjà
            return res.status(409).json({ message: 'L\'email fourni est déjà utilisé.' });
        }
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil.' });
    }
};