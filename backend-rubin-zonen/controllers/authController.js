const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('./emailController');
const { addLog } = require('./logController');

// Function for registering a new user
exports.register = async (req, res) => {
    const {
        email, password, prefix, first_name, last_name, phone_number,
        designation, seller, company_name, company_owner, company_type, company_email,
        company_address, company_city, company_country, company_zip_code, id_document_url,
        business_registration_url, how_found_us
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!email.includes('@') || !email.includes('.')) {
         return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (password.length < 6) { // Minimum password length
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
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
            ) RETURNING id, email, is_admin, is_active;
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

        // Generate a JWT token for the newly registered user
        const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, {
            expiresIn: '240h'
        });//TODO changer si besoin

        res.status(201).json({
            message: 'Registration successful.',
            token,
            user: { id: user.id, email: user.email, is_admin: user.is_admin }
        });
        await addLog({
            userId: user.id,
            level: 'info',
            action: 'USER_REGISTERED',
            details: { email: user.email }
        });


    } catch (error) {
        console.error('Error during user registration:', error);
        if (error.code === '23505') {
            await addLog({
                level: 'warn',
                action: 'USER_REGISTRATION_FAILED',
                details: { email: email, reason: 'Email already registered' }
            });
            return res.status(409).json({ message: 'This email is already registered.' });
        }
        await addLog({
            level: 'error',
            action: 'USER_REGISTRATION_FAILED',
            details: { email: email, reason: error.message }
        });
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Function for logging in an existing user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();

        if (result.rows.length === 0) {
            await addLog({
                level: 'warn',
                action: 'USER_LOGIN_FAILED',
                details: { email: email, reason: 'Incorrect email or password' }
            });
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const user = result.rows[0];

        // Verify hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await addLog({
                level: 'warn',
                action: 'USER_LOGIN_FAILED',
                details: { email: email, reason: 'Incorrect email or password' }
            });
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        // Check if user is active
        if (!user.is_active) {
            await addLog({
                level: 'warn',
                action: 'USER_LOGIN_FAILED',
                details: { email: email, reason: 'Account inactive' }
            });
            return res.status(403).json({ message: 'Your account is inactive. Please contact the administrator.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, {
            expiresIn: '240h'
        });

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: { id: user.id, email: user.email, is_admin: user.is_admin, is_active: user.is_active}
        });
        await addLog({
            userId: user.id,
            level: 'info',
            action: 'USER_LOGIN_SUCCESS',
            details: { email: user.email }
        });

    } catch (error) {
        console.error('Error during user login:', error);
        await addLog({
            level: 'error',
            action: 'USER_LOGIN_FAILED',
            details: { email: email, reason: error.message }
        });
        res.status(500).json({ message: 'Server error during login.' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const client = await db.connect();
        const userResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            client.release();
            return res.status(404).json({ message: 'No user with this email found.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await client.query('UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3', [token, expires, email]);
        client.release();

        //TODO: Change the url for production
        const resetURL = `http://localhost:4173/reset-password/${token}`;

        // Compose email content
        const textContent = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetURL}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        // Send the email
        await sendEmail(email, 'Password Reset', textContent);

        await addLog({
            level: 'info',
            action: 'PASSWORD_RESET_EMAIL_SENT',
            details: { email: email }
        });
        res.status(200).json({ message: 'A password reset email has been sent.' });
    } catch (error) {
        await addLog({
            level: 'error',
            action: 'PASSWORD_RESET_EMAIL_FAILED',
            details: { email: email, reason: error.message }
        });
        console.error('Error during forgot password procedure:', error);
        res.status(500).json({ message: 'Server error.' });
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
            await addLog({
                userId: user.id,
                level: 'warn',
                action: 'PASSWORD_RESET_FAILED',
                details: { token: token, reason: 'Invalid or expired token' }
            });
            return res.status(400).json({ message: 'The password reset token is invalid or has expired.' });
        }

        const user = userResult.rows[0];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await client.query('UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2', [hashedPassword, user.id]);
        client.release();
        await addLog({
            userId: user.id,
            level: 'info',
            action: 'PASSWORD_RESET_SUCCESS',
            details: { email: user.email }
        });
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        await addLog({
            level: 'error',
            action: 'PASSWORD_RESET_FAILED',
            details: { token: token, reason: error.message }
        });
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.checkToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ isValid: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ isValid: false, message: 'Access denied. Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const client = await db.connect();
        const result = await client.query('SELECT is_admin, is_active FROM users WHERE id = $1', [decoded.id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ isValid: false, message: 'User not found.' });
        }

        const user = result.rows[0];
        if (!user.is_active) {
            return res.status(403).json({ isValid: false, message: 'Your account is inactive. Please contact the administrator.' });
        }

        res.status(200).json({ isValid: true, is_admin: user.is_admin });
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(403).json({ isValid: false, message: 'Invalid or expired token.' });
    }
};
