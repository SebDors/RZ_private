// controllers/diamantsController.js
const db = require('../config/db');
const { param } = require('../routes/diamantsRoutes');

/**
 * Fonction d'aide pour ajouter un filtre de type 'IN' à la clause WHERE.
 * Gère les paramètres de requête qui peuvent être une seule valeur ou une liste CSV.
 * @param {string} paramName - Nom du paramètre de requête (ex: 'color', 'shape').
 * @param {Array<string>} filters - Tableau des conditions WHERE.
 * @param {Array<any>} values - Tableau des valeurs des paramètres pour la requête SQL.
 * @param {number} paramIndex - Index actuel pour les placeholders SQL ($1, $2, ...).
 * @returns {number} Le nouvel index des paramètres après ajout du filtre.
 */

const addInFilter = (paramName, queryParams, filters, values, paramIndex) => {
    if (queryParams[paramName]) {
        let paramValues;
        let queryParamValue = queryParams[paramName];

        if (typeof queryParamValue === 'string') {
            paramValues = queryParamValue.split(',').map(v => v.trim()).filter(v => v);
        } else if (Array.isArray(queryParamValue)) {
            paramValues = queryParamValue.map(v => v.trim()).filter(v => v);
        } else {
            paramValues = [String(queryParamValue).trim()].filter(v => v);
        }

        if (paramValues.length > 0) {
            const placeholders = paramValues.map((_, index) => `$${paramIndex + index}`).join(', ');
            filters.push(`${paramName} IN (${placeholders})`);
            values.push(...paramValues);
            paramIndex += paramValues.length;
        }
    }
    return paramIndex;
};

const addInRangeMinFilter = (paramName, rowName, queryParams, filters, values, paramIndex) => {
    if (queryParams[paramName]) {
        filters.push(`${rowName} >= $${paramIndex++}`)
        values.push(parseFloat(queryParams[paramName]));
    }
    return paramIndex;
}
const addInRangeMaxFilter = (paramName, rowName, queryParams, filters, values, paramIndex) => {
    if (queryParams[paramName]) {
        filters.push(`${rowName} <= $${paramIndex++}`)
        values.push(parseFloat(queryParams[paramName]));
    }
    return paramIndex;
}

// Fonction utilitaire pour construire la clause WHERE des filtres
const buildWhereClause = (queryParams) => {
    const filters = [];
    const values = [];
    let paramIndex = 1;

    paramIndex = addInFilter('shape', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minCarat', 'weight', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxCarat', 'weight', queryParams, filters, values, paramIndex);

    paramIndex = addInFilter('color', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('clarity', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('cut', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('polish', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('symmetry', queryParams, filters, values, paramIndex);

    paramIndex = addInFilter('fluorescence_intensity', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('lab', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minPriceCarat', 'price_carat', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxPriceCarat', 'price_carat', queryParams, filters, values, paramIndex);
    return { filters, values };
};

// Logique pour récupérer tous les diamants avec filtrage et tri
exports.getAllDiamants = async (req, res) => {
    try {
        const { filters, values } = buildWhereClause(req.query);

        let queryText = 'SELECT * FROM diamants';
        if (filters.length > 0) {
            queryText += ` WHERE ${filters.join(' AND ')}`;
        }

        queryText += ' ORDER BY stock_id ASC LIMIT 100'; // Toujours limiter le nombre de résultats pour éviter de surcharger

        const client = await db.connect();
        const result = await client.query(queryText, values);
        console.log(queryText, "===AVEC===>", values);
        client.release();

        const filteredRows = result.rows.map(row => ({
            stock_id: row.stock_id,
            shape: row.shape,
            color: row.color,
            weight: row.weight
        }));
        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Erreur lors de la récupération des diamants avec filtres/tri :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des diamants.' });
    }
};

exports.getDiamantById = async (req, res) => {
    const { stock_id } = req.params;
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM diamants WHERE stock_id = $1', [stock_id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Diamant non trouvé.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Erreur lors de la récupération du diamant ${stock_id} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du diamant.' });
    }
};