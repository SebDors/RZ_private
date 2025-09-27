const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fonction d'inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    const {
        email, password, prefix, first_name, last_name, phone_number,
        designation, seller, company_name, company_owner, company_type, company_email,
        company_address, company_city, company_country, company_zip_code, id_document_url,
        business_registration_url, how_found_us
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
    }
    if (!email.includes('@') || !email.includes('.')) {
         return res.status(400).json({ message: 'Format d\'email invalide.' });
    }
    if (password.length < 6) { // Minimum password length
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const client = await db.connect();
        const queryText = `
            INSERT INTO users (
                email, password, prefix, first_name, last_name, phone_number,
                designation, seller, company_name, company_owner, company_type, company_email,
                company_address, company_city, company_country, company_zip_code, id_document_url,
                business_registration_url, how_found_us
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
            ) RETURNING id, email, role, is_active;
        `;
        const values = [
            email, hashedPassword, prefix, first_name, last_name, phone_number,
            designation, seller, company_name, company_owner, company_type, company_email,
            company_address, company_city, company_country, company_zip_code, id_document_url,
            business_registration_url, how_found_us
        ];

        const result = await client.query(queryText, values);
        client.release();

        const user = result.rows[0];

        // Générer un token JWT pour l'utilisateur nouvellement enregistré
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({
            message: 'Inscription réussie.',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
        }
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
};

// Fonction de connexion d'un utilisateur existant
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
    }

    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = result.rows[0];

        // Vérifier le mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Vérifier si l'utilisateur est actif
        if (!user.is_active) {
            return res.status(403).json({ message: 'Votre compte est inactif. Veuillez contacter l\'administrateur.' });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Connexion réussie.',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
};
