const db = require('../config/db');

// --- Fonctions pour les Utilisateurs ---
// POST /api/quotes - Créer un nouveau devis
exports.createQuote = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_ids } = req.body; // Attendre un tableau d'ID de diamants

    if (!diamond_stock_ids || !Array.isArray(diamond_stock_ids) || diamond_stock_ids.length === 0) {
        return res.status(400).json({ message: 'Un tableau d\'ID de diamants (diamond_stock_ids) est obligatoire.' });
    }

    const client = await db.connect();
    try {
        await client.query('BEGIN'); // Démarrer une transaction

        // 1. Insérer le devis principal
        const quoteInsertQuery = 'INSERT INTO quotes (user_id) VALUES ($1) RETURNING id, created_at, status;';
        const quoteResult = await client.query(quoteInsertQuery, [userId]);
        const newQuote = quoteResult.rows[0];

        // 2. Insérer chaque diamant dans quote_items
        const quoteItemsQuery = 'INSERT INTO quote_items (quote_id, diamond_stock_id) VALUES ($1, $2);';
        for (const stockId of diamond_stock_ids) {
            await client.query(quoteItemsQuery, [newQuote.id, stockId]);
        }

        await client.query('COMMIT'); // Valider la transaction

        res.status(201).json({ message: 'Devis créé avec succès.', quote: newQuote });

    } catch (error) {
        await client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
        console.error('Erreur lors de la création du devis :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création du devis.' });
    } finally {
        client.release();
    }
};

// GET /api/quotes - Récupérer les devis de l'utilisateur connecté
exports.getUserQuotes = async (req, res) => {
    const userId = req.user.id;
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                q.id,
                q.status,
                q.created_at,
                json_agg(json_build_object(
                    'stock_id', d.stock_id,
                    'shape', d.shape,
                    'weight', d.weight,
                    'color', d.color
                )) AS items
            FROM quotes q
            JOIN quote_items qi ON q.id = qi.quote_id
            JOIN diamants d ON qi.diamond_stock_id = d.stock_id
            WHERE q.user_id = $1
            GROUP BY q.id
            ORDER BY q.created_at DESC;
        `;
        const result = await client.query(queryText, [userId]);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des devis de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des devis.' });
    }
};

// --- Fonctions pour les Administrateurs ---
// GET /api/quotes/all - Récupérer tous les devis
exports.getAllQuotes = async (req, res) => {
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                q.id,
                q.status,
                q.created_at,
                q.updated_at,
                json_build_object(
                    'id', u.id,
                    'email', u.email,
                    'first_name', u.first_name,
                    'last_name', u.last_name
                ) AS "user",
                json_agg(json_build_object(
                    'stock_id', d.stock_id,
                    'shape', d.shape,
                    'weight', d.weight,
                    'color', d.color
                )) AS items
            FROM quotes q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN quote_items qi ON q.id = qi.quote_id
            LEFT JOIN diamants d ON qi.diamond_stock_id = d.stock_id
            GROUP BY q.id, u.id
            ORDER BY q.created_at DESC;
        `;
        const result = await client.query(queryText);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les devis :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération de tous les devis.' });
    }
};

// GET /api/quotes/:id - Récupérer un devis spécifique par son ID
exports.getQuoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                q.id,
                q.status,
                q.created_at,
                q.updated_at,
                json_build_object(
                    'id', u.id,
                    'email', u.email,
                    'first_name', u.first_name,
                    'last_name', u.last_name,
                    'company_name', u.company_name
                ) AS "user",
                json_agg(json_build_object(
                    'stock_id', d.stock_id,
                    'shape', d.shape,
                    'weight', d.weight,
                    'color', d.color,
                    'clarity', d.clarity,
                    'price_carat', d.price_carat
                )) AS items
            FROM quotes q
            JOIN users u ON q.user_id = u.id
            LEFT JOIN quote_items qi ON q.id = qi.quote_id
            LEFT JOIN diamants d ON qi.diamond_stock_id = d.stock_id
            WHERE q.id = $1
            GROUP BY q.id, u.id;
        `;
        const result = await client.query(queryText, [id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Devis non trouvé.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error)
    {
        console.error(`Erreur lors de la récupération du devis ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du devis.' });
    }
};

// PUT /api/quotes/:id - Mettre à jour le statut d'un devis
exports.updateQuoteStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Le statut est obligatoire.' });
    }

    try {
        const client = await db.connect();
        const queryText = 'UPDATE quotes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;';
        const result = await client.query(queryText, [status, id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Devis non trouvé.' });
        }
        res.status(200).json({ message: 'Statut du devis mis à jour.', quote: result.rows[0] });
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du statut du devis ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du statut.' });
    }
};