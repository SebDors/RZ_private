const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const { addLog } = require('./logController');

// Logic to retrieve all users
exports.getAllUsers = async (req, res) => {
    try {
        const client = await db.connect();
        // Do not select the password in the results (security)
        const result = await client.query('SELECT * FROM users');
        client.release();

        if (req.header.origin){
            const origin = req.header.origin;
            res.setHeader('Access-Control-Allow-Origin', origin);
            console.log("CORS for origin: " + origin);
        }
        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'ADMIN_GET_ALL_USERS',
            details: { message: `Admin retrieved ${result.rows.length} users.` },
        });
        res.status(200).json(result.rows);
    } catch (error) {
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_GET_ALL_USERS_FAILED',
            details: { error: error.message },
        });
        console.error('Error retrieving users. Error: ', error);
        res.status(500).json({ message: 'Server error while retrieving users.' });
    }
};

// Logic to retrieve a user by their ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await db.connect();
        // Do not select the password (security)
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        client.release();

        if (result.rows.length === 0) {
            await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'ADMIN_GET_USER_NOT_FOUND',
                details: { targetUserId: id },
            });
            return res.status(404).json({ message: 'User not found.' });
        }
        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'ADMIN_GET_USER_BY_ID',
            details: { targetUserId: id },
        });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_GET_USER_BY_ID_FAILED',
            details: { targetUserId: id, error: error.message },
        });
        console.error(`Error retrieving user ${id}:`, error);
        res.status(500).json({ message: 'Server error while retrieving user.' });
    }
};

// Function to create a new user (administrative use, password required)
exports.createUser = async (req, res) => {
    const {
        email, password, prefix, first_name, last_name, phone_number,
        designation, seller, company_name, company_owner, company_type, company_email,
        company_address, company_city, company_country, company_zip_code, id_document_url,
        business_registration_url, how_found_us, is_active
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

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
        const newUser = result.rows[0];

        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'ADMIN_CREATE_USER_SUCCESS',
            details: { createdUserId: newUser.id, email: newUser.email },
        });
        res.status(201).json({
            message: 'User created successfully.',
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === '23505') { // Code for unique constraint violation (email already exists)
            await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'ADMIN_CREATE_USER_FAILED',
                details: { email, reason: 'Email already exists' },
            });
            return res.status(409).json({ message: 'This email is already registered.' });
        }
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_CREATE_USER_FAILED',
            details: { email, error: error.message },
        });
        res.status(500).json({ message: 'Server error while creating user.' });
    }
};

// Function to update an existing user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    // Allowed columns to be updated
    const allowedColumns = [
        'email', 'password', 'prefix', 'first_name', 'last_name', 'phone_number',
        'designation', 'seller', 'company_name', 'company_owner', 'company_type', 'company_email',
        'company_address', 'company_city', 'company_country', 'company_zip_code', 'id_document_url',
        'business_registration_url', 'how_found_us', 'is_admin', 'is_active'
    ];

    for (const key of allowedColumns) {
        if (updates[key] !== undefined) { // Check if the field is present in the request
            if (key === 'password' && updates[key]) {
                // Hash the new password if provided
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
        await addLog({
            userId: req.user.id,
            level: 'warn',
            action: 'ADMIN_UPDATE_USER_INVALID_INPUT',
            details: { targetUserId: id, message: 'No valid fields provided for update.' },
        });
        return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    values.push(id); // Add user ID for the WHERE clause

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
            await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'ADMIN_UPDATE_USER_NOT_FOUND',
                details: { targetUserId: id },
            });
            return res.status(404).json({ message: 'User not found for update.' });
        }
        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'ADMIN_UPDATE_USER_SUCCESS',
            details: { targetUserId: id, updatedFields: Object.keys(updates) },
        });
        res.status(200).json({
            message: 'User updated successfully.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        if (error.code === '23505') { // Email conflict if updated email already exists
             await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'ADMIN_UPDATE_USER_FAILED',
                details: { targetUserId: id, reason: 'Email conflict' },
            });
            return res.status(409).json({ message: 'The provided email is already in use.' });
        }
         await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_UPDATE_USER_FAILED',
            details: { targetUserId: id, error: error.message },
        });
        res.status(500).json({ message: 'Server error while updating user.' });
    }
};

// Function to delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await db.connect();
        const queryText = 'DELETE FROM users WHERE id = $1 RETURNING id, email;';
        const result = await client.query(queryText, [id]);
        client.release();

        if (result.rows.length === 0) {
             await addLog({
                userId: req.user.id,
                level: 'warn',
                action: 'ADMIN_DELETE_USER_NOT_FOUND',
                details: { targetUserId: id },
            });
            return res.status(404).json({ message: 'User not found for deletion.' });
        }

        const deletedUser = result.rows[0];
        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'ADMIN_DELETE_USER_SUCCESS',
            details: { deletedUserId: deletedUser.id, email: deletedUser.email },
        });
        res.status(200).json({ message: `User with ID ${id} and email ${deletedUser.email} deleted successfully.` });
    } catch (error) {
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_DELETE_USER_FAILED',
            details: { targetUserId: id, error: error.message },
        });
        console.error(`Error deleting user ${id}:`, error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
};

// Logic to retrieve the connected user's profile
exports.getConnectedUserProfile = async (req, res) => {
    const userId = req.user.id; // The user ID is attached by the authentication middleware
    try {
        const client = await db.connect();
        const result = await client.query('SELECT id, email, prefix, first_name, last_name, phone_number, designation, seller, company_name, company_owner, company_type, company_email, company_address, company_city, company_country, company_zip_code, id_document_url, business_registration_url, how_found_us, is_admin, is_active, created_at, updated_at FROM users WHERE id = $1', [userId]);
        client.release();

        if (result.rows.length === 0) {
            // This should not happen if the token is valid and the user exists
             await addLog({
                userId,
                level: 'warn',
                action: 'GET_PROFILE_NOT_FOUND',
                details: { message: 'User profile not found despite valid token.' },
            });
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // It makes to much logs. Notify only errors
        // await addLog({
        //     userId,
        //     level: 'info',
        //     action: 'GET_PROFILE_SUCCESS',
        //     details: {},
        // });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'GET_PROFILE_FAILED',
            details: { error: error.message },
        });
        console.error(`Error retrieving user profile ${userId}:`, error);
        res.status(500).json({ message: 'Server error while retrieving profile.' });
    }
};

// Logic to update the connected user's profile
exports.updateConnectedUserProfile = async (req, res) => {
    const userId = req.user.id; // The user ID is attached by the middleware
    const updates = req.body;

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    // Columns the user CAN update themselves
    const allowedSelfUpdateColumns = [
        'prefix', 'first_name', 'last_name', 'phone_number',
        'designation', 'seller', 'company_name', 'company_owner', 'company_type', 'company_email',
        'company_address', 'company_city', 'company_country', 'company_zip_code', 'id_document_url',
        'business_registration_url', 'how_found_us', 'password' // Allow password change
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
        await addLog({
            userId,
            level: 'warn',
            action: 'UPDATE_PROFILE_INVALID_INPUT',
            details: { message: 'No valid fields provided for profile update.' },
        });
        return res.status(400).json({ message: 'No valid fields provided for profile update.' });
    }

    values.push(userId); // The last parameter is the user ID for the WHERE clause

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
             await addLog({
                userId,
                level: 'warn',
                action: 'UPDATE_PROFILE_NOT_FOUND',
                details: { message: 'User profile not found for update.' },
            });
            return res.status(404).json({ message: 'User profile not found for update.' });
        }
        await addLog({
            userId,
            level: 'info',
            action: 'UPDATE_PROFILE_SUCCESS',
            details: { updatedFields: Object.keys(updates) },
        });
        res.status(200).json({
            message: 'Profile updated successfully.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(`Error updating user profile ${userId}:`, error);
        if (error.code === '23505') { // Email conflict if updated email already exists
             await addLog({
                userId,
                level: 'warn',
                action: 'UPDATE_PROFILE_FAILED',
                details: { reason: 'Email conflict' },
            });
            return res.status(409).json({ message: 'The provided email is already in use.' });
        }
         await addLog({
            userId,
            level: 'error',
            action: 'UPDATE_PROFILE_FAILED',
            details: { error: error.message },
        });
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};