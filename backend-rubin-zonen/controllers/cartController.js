const db = require('../config/db');
const { addLog } = require('./logController');

// GET /api/cart - Retrieve user's cart content
exports.getCart = async (req, res) => {
    const userId = req.user.id; // The user ID is attached by the authentication middleware
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
        await addLog({
            userId,
            level: 'info',
            action: 'view_cart',
            details: { itemCount: result.rows.length }
        });
        res.status(200).json(result.rows);
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'view cart',
            details: { error: error.message }
        });
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: 'Server error retrieving cart.' });
    }
};

// POST /api/cart - Add item to cart
exports.addItemToCart = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id, quantity = 1 } = req.body; // Quantity is optional, defaults to 1

    if (!diamond_stock_id) {
        return res.status(400).json({ message: 'The diamond ID (diamond_stock_id) is required.' });
    }

    try {
        const client = await db.connect();
        // Use ON CONFLICT to handle cases where the item is already in the cart (thanks to our UNIQUE constraint)
        const queryText = `
            INSERT INTO cart_items (user_id, diamond_stock_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, diamond_stock_id)
            DO UPDATE SET quantity = cart_items.quantity + $3
            RETURNING *;
        `;
        const result = await client.query(queryText, [userId, diamond_stock_id, quantity]);
        client.release();
        await addLog({
            userId,
            level: 'info',
            action: 'add_to_cart',
            details: { diamond_stock_id}
        })
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'add to cart',
            details: { diamond_stock_id, error: error.message }
        });
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server error adding item to cart.' });
    }
};

// PUT /api/cart/:diamond_stock_id - Deprecated, no longer used
// exports.updateCartItemQuantity = async (req, res) => {
//     const userId = req.user.id;
//     const { diamond_stock_id } = req.params;
//     const { quantity } = req.body;

//     if (typeof quantity !== 'number' || quantity < 1) {
//         return res.status(400).json({ message: 'The quantity must be a number greater than or equal to 1.' });
//     }

//     try {
//         const client = await db.connect();
//         const queryText = `
//             UPDATE cart_items
//             SET quantity = $1
//             WHERE user_id = $2 AND diamond_stock_id = $3
//             RETURNING *;
//         `;
//         const result = await client.query(queryText, [quantity, userId, diamond_stock_id]);
//         client.release();

//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: 'Item not found in cart.' });
//         }

//         res.status(200).json(result.rows[0]);
//     } catch (error) {
//         console.error('Error updating item quantity in cart:', error);
//         res.status(500).json({ message: 'Server error updating item quantity in cart.' });
//     }
// };

// DELETE /api/cart/:diamond_stock_id - Delete item from cart
exports.deleteCartItem = async (req, res) => {
    const userId = req.user.id;
    const { diamond_stock_id } = req.params;

    try {
        const client = await db.connect();
        const queryText = 'DELETE FROM cart_items WHERE user_id = $1 AND diamond_stock_id = $2 RETURNING *;';
        const result = await client.query(queryText, [userId, diamond_stock_id]);
        client.release();

        if (result.rows.length === 0) {
            await addLog({
                userId,
                level: 'warn',
                action: 'diamond not found in cart for deletion',
                details: { diamond_stock_id }
            });
            return res.status(404).json({ message: 'Item not found in cart.' });
        }
        await addLog({
            userId,
            level: 'info',
            action: 'delete_from_cart',
            details: { diamond_stock_id }
        });
        res.status(200).json({ message: 'Item successfully removed from cart.', deletedItem: result.rows[0] });
    } catch (error) {
        await addLog({
            userId,
            level: 'error',
            action: 'delete from cart',
            details: { diamond_stock_id, error: error.message }
        });
        console.error('Error deleting item from cart:', error);
        res.status(500).json({ message: 'Server error deleting item from cart.' });
    }
};