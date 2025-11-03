const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { apiInstance } = require('../services/emailService');

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
         return res.status(400).json({ message: "Format d'email invalide." });
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
            expiresIn: '240h'
        });//TODO changer si besoin

        res.status(201).json({
            message: 'Inscription réussie.',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Erreur lors de l'inscription de l'utilisateur :", error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
        }
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
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
            return res.status(403).json({ message: "Votre compte est inactif. Veuillez contacter l'administrateur." });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '240h'
        });

        res.status(200).json({
            message: 'Connexion réussie.',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const client = await db.connect();
        const userResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            client.release();
            return res.status(404).json({ message: 'Aucun utilisateur avec cet email.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await client.query('UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3', [token, expires, email]);
        client.release();

        const resetURL = `http://localhost:3000/reset-password/${token}`;

        let sendSmtpEmail = {
            to: [{ email: email }],
            subject: 'Réinitialisation de votre mot de passe',
            textContent: `Vous recevez cet e-mail car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n` +
                `Veuillez cliquer sur le lien suivant, ou le coller dans votre navigateur pour terminer le processus :\n\n` +
                `${resetURL}\n\n` +
                `Si vous n'avez pas demandé cela, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.\n`,
            sender: { name: 'Rubin & Zonen', email: 'noreply@rubinandzonen.com' },
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.status(200).json({ message: 'Un e-mail de réinitialisation de mot de passe a été envoyé.' });
    } catch (error) {
        console.error('Erreur lors de la procédure de mot de passe oublié :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const client = await db.connect();
        const userResult = await client.query('SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()', [token]);

        if (userResult.rows.length === 0) {
            client.release();
            return res.status(400).json({ message: 'Le jeton de réinitialisation de mot de passe est invalide ou a expiré.' });
        }

        const user = userResult.rows[0];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await client.query('UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2', [hashedPassword, user.id]);
        client.release();

        res.status(200).json({ message: 'Le mot de passe a été réinitialisé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
