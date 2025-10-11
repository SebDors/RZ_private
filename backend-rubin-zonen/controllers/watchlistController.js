const db = require('../config/db');

// GET /api/watchlist - Récupérer la watchlist de l'utilisateur
exports.getWatchlist = async (req, res) => {
    const userId = req.user.id;
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                w.diamond_stock_id,
                w.added_at,
                d.shape,
                d.weight,
                d.color,
                d.clarity,
                d.price_carat,
                d.image_file
            FROM watchlist_items w
            JOIN diamants d ON w.diamond_stock_id = d.stock_id
            WHERE w.user_id = $1
            ORDER BY w.added_at DESC;
        `;
        const result = await client.query(queryText, [userId]);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération de la watchlist :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération de la watchlist.' });
    }
};

// POST /api/watchlist - Ajouter un article à la watchlist
exports.addItemToWatchlist = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id } = req.body;

    if (!diamond_stock_id) {
        return res.status(400).json({ message: 'L\'ID du diamant (diamond_stock_id) est obligatoire.' });
    }

    try {
        const client = await db.connect();
        // ON CONFLICT DO NOTHING : si l'article est déjà présent, ne rien faire et ne pas renvoyer d'erreur.
        const queryText = `
            INSERT INTO watchlist_items (user_id, diamond_stock_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, diamond_stock_id) DO NOTHING
            RETURNING *;
        `;
        const result = await client.query(queryText, [userId, diamond_stock_id]);
        client.release();

        if (result.rows.length === 0) {
            // Ce cas arrive si l'article était déjà dans la watchlist
            return res.status(200).json({ message: 'Cet article est déjà dans votre watchlist.' });
        }

        res.status(201).json({ message: 'Article ajouté à la watchlist.', item: result.rows[0] });
    } catch (error) {
        console.error('Erreur lors de l\'ajout à la watchlist :', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'ajout à la watchlist.' });
    }
};

// DELETE /api/watchlist/:diamond_stock_id - Supprimer un article de la watchlist
exports.deleteWatchlistItem = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id } = req.params;

    try {
        const client = await db.connect();
        const queryText = 'DELETE FROM watchlist_items WHERE user_id = $1 AND diamond_stock_id = $2 RETURNING *;';
        const result = await client.query(queryText, [userId, diamond_stock_id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Article non trouvé dans la watchlist.' });
        }

        res.status(200).json({ message: 'Article supprimé de la watchlist avec succès.', deletedItem: result.rows[0] });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article de la watchlist :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'article.' });
    }
};