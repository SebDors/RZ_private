const db = require('../config/db');

// GET /api/cart - Récupérer le contenu du panier de l'utilisateur
exports.getCart = async (req, res) => {
    const userId = req.user.id; // L'ID de l'utilisateur est attaché par le middleware d'authentification
    try {
        const client = await db.connect();
        const queryText = `
            SELECT 
                ci.diamond_stock_id,
                ci.quantity,
                d.shape,
                d.weight,
                d.color,
                d.clarity,
                d.price_carat,
                d.image_file,
                (ci.quantity * d.price_carat) AS total_price
            FROM cart_items ci
            JOIN diamants d ON ci.diamond_stock_id = d.stock_id
            WHERE ci.user_id = $1
            ORDER BY ci.added_at DESC;
        `;
        const result = await client.query(queryText, [userId]);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération du panier :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du panier.' });
    }
};

// POST /api/cart - Ajouter un article au panier
exports.addItemToCart = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id, quantity = 1 } = req.body; // La quantité est optionnelle, par défaut 1

    if (!diamond_stock_id) {
        return res.status(400).json({ message: 'L\'ID du diamant (diamond_stock_id) est obligatoire.' });
    }

    try {
        const client = await db.connect();
        // Utilisation de ON CONFLICT pour gérer les cas où l'article est déjà dans le panier (grâce à notre contrainte UNIQUE)
        const queryText = `
            INSERT INTO cart_items (user_id, diamond_stock_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, diamond_stock_id)
            DO UPDATE SET quantity = cart_items.quantity + $3
            RETURNING *;
        `;
        const result = await client.query(queryText, [userId, diamond_stock_id, quantity]);
        client.release();

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'article au panier :', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'article au panier.' });
    }
};

// PUT /api/cart/:diamond_stock_id - Mettre à jour la quantité d'un article
exports.updateCartItemQuantity = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'La quantité doit être un nombre supérieur ou égal à 1.' });
    }

    try {
        const client = await db.connect();
        const queryText = `
            UPDATE cart_items
            SET quantity = $1
            WHERE user_id = $2 AND diamond_stock_id = $3
            RETURNING *;
        `;
        const result = await client.query(queryText, [quantity, userId, diamond_stock_id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Article non trouvé dans le panier.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité de l\'article :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la quantité.' });
    }
};

// DELETE /api/cart/:diamond_stock_id - Supprimer un article du panier
exports.deleteCartItem = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id } = req.params;

    try {
        const client = await db.connect();
        const queryText = 'DELETE FROM cart_items WHERE user_id = $1 AND diamond_stock_id = $2 RETURNING *;';
        const result = await client.query(queryText, [userId, diamond_stock_id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Article non trouvé dans le panier.' });
        }

        res.status(200).json({ message: 'Article supprimé du panier avec succès.', deletedItem: result.rows[0] });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article du panier :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'article.' });
    }
};