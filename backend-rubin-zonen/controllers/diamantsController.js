// controllers/diamantsController.js
const db = require('../config/db');

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
    paramIndex = addInFilter('is_special', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('is_upcoming', queryParams, filters, values, paramIndex);
    // Finishing
    paramIndex = addInFilter('cut_grade', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('polish', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('symmetry', queryParams, filters, values, paramIndex);

    paramIndex = addInFilter('fluorescence_intensity', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('fluorescence_color', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('lab', queryParams, filters, values, paramIndex);

    paramIndex = addInFilter('fancy_color', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('fancy_color_intensity', queryParams, filters, values, paramIndex);
    paramIndex = addInFilter('fancy_color_overtone', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minPriceCarat', 'price_carat', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxPriceCarat', 'price_carat', queryParams, filters, values, paramIndex);

    //Parameters
    paramIndex = addInRangeMinFilter('minTable', 'table_pct', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxTable', 'table_pct', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minDepth', 'depth_pct', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxDepth', 'depth_pct', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minRatio', '', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxRatio', '', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minLength', '', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxLength', '', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minWidth', '', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxWidth', '', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minHeight', '', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxHeight', '', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minCrownAngle', 'crown_angle', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxCrownAngle', 'crown_angle', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minCrownHeight', 'crown_height', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxCrownHeight', 'crown_height', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minGirdle', 'girdle_pct', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxGirdle', 'girdle_pct', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minPavillonAngle', 'pavillon_angle', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxPavillonAngle', 'pavillon_angle', queryParams, filters, values, paramIndex);

    paramIndex = addInRangeMinFilter('minPavillonHeight', 'pavilion_depth', queryParams, filters, values, paramIndex);
    paramIndex = addInRangeMaxFilter('maxPavillonHeight', 'pavilion_depth', queryParams, filters, values, paramIndex);
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

        queryText += ' ORDER BY stock_id ASC';

        const client = await db.connect();
        const result = await client.query(queryText, values);
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

// Fonction pour créer un nouveau diamant
exports.createDiamant = async (req, res) => {
    const {
        stock_id, availability, shape, weight, color, clarity, cut_grade,
        polish, symmetry, fluorescence_intensity, fluorescence_color, measurements,
        lab, certificate_number, treatment, price_carat, fancy_color,
        fancy_color_intensity, fancy_color_overtone, depth_pct, table_pct,
        girdle_thin, girdle_thick, girdle_pct, girdle_condition, culet_size,
        culet_condition, crown_height, crown_angle, pavilion_depth, pavilion_angle,
        laser_inscription, comment, country, state, city,
        is_matched_pair_separable, pair_stock_id, allow_raplink_feed, parcel_stones,
        certificate_filename, diamond_image,
        "3d_file": threeD_file, trade_show, member_comments,
        rap, disc, video_file, image_file, certificate_file
    } = req.body;

    const values = [
        stock_id, availability, shape, weight, color, clarity, cut_grade,
        polish, symmetry, fluorescence_intensity, fluorescence_color, measurements,
        lab, certificate_number, treatment, price_carat, fancy_color,
        fancy_color_intensity, fancy_color_overtone, depth_pct, table_pct,
        girdle_thin, girdle_thick, girdle_pct, girdle_condition, culet_size,
        culet_condition, crown_height, crown_angle, pavilion_depth, pavilion_angle,
        laser_inscription, comment, country, state, city,
        is_matched_pair_separable, pair_stock_id, allow_raplink_feed, parcel_stones,
        certificate_filename, diamond_image, threeD_file,
        trade_show, member_comments,
        rap, disc, video_file, image_file, certificate_file
    ];

    const columns = [
        'stock_id', 'availability', 'shape', 'weight', 'color', 'clarity', 'cut_grade',
        'polish', 'symmetry', 'fluorescence_intensity', 'fluorescence_color', 'measurements',
        'lab', 'certificate_number', 'treatment', 'price_carat', 'fancy_color',
        'fancy_color_intensity', 'fancy_color_overtone', 'depth_pct', 'table_pct',
        'girdle_thin', 'girdle_thick', 'girdle_pct', 'girdle_condition', 'culet_size',
        'culet_condition', 'crown_height', 'crown_angle', 'pavilion_depth', 'pavilion_angle',
        'laser_inscription', 'comment', 'country', 'state', 'city',
        'is_matched_pair_separable', 'pair_stock_id', 'allow_raplink_feed', 'parcel_stones',
        'certificate_filename', 'diamond_image', '"3d_file"', 'trade_show', 'member_comments',
        'rap', 'disc', 'video_file', 'image_file', 'certificate_file'
    ];

    // Générer les placeholders dynamiquement
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    const queryText = `
        INSERT INTO diamants (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
    `;

    try {
        const client = await db.connect();
        const result = await client.query(queryText, values);
        client.release();
        res.status(201).json(result.rows[0]); // Retourne le diamant créé
    } catch (error) {
        console.error('Erreur lors de la création du diamant :', error);
        // Gérer les erreurs de clé primaire en double
        if (error.code === '23505') { // Code d'erreur pour violation de clé unique
            return res.status(409).json({ message: `Un diamant avec l'ID ${stock_id} existe déjà.`, error: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur lors de la création du diamant.', error: error.message });
    }
};

// Fonction pour mettre à jour un diamant existant
exports.updateDiamant = async (req, res) => {
    const { stock_id } = req.params; // ID du diamant à mettre à jour
    const updates = req.body; // Corps de la requête contient les champs à modifier

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    // Construire dynamiquement les clauses SET et les valeurs
    for (const key in updates) {
        // Ignorer stock_id dans les mises à jour si présent, car c'est la clé d'identification
        if (key === 'stock_id') continue;

        let columnName = key;
        if (key === '3d_file') { // Gérer le cas de la colonne entre guillemets
            columnName = '"3d_file"';
        }

        setClauses.push(`${columnName} = $${paramIndex++}`);
        values.push(updates[key]);
    }

    if (setClauses.length === 0) {
        return res.status(400).json({ message: 'Aucun champ à mettre à jour fourni.' });
    }

    values.push(stock_id); // Le dernier paramètre est le stock_id pour la clause WHERE

    const queryText = `
        UPDATE diamants
        SET ${setClauses.join(', ')}
        WHERE stock_id = $${paramIndex}
        RETURNING *;
    `;

    try {
        const client = await db.connect();
        const result = await client.query(queryText, values);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Diamant non trouvé pour la mise à jour.' });
        }

        res.status(200).json(result.rows[0]); // Retourne le diamant mis à jour
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du diamant ${stock_id} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du diamant.', error: error.message });
    }
};

// Fonction pour supprimer un diamant
exports.deleteDiamant = async (req, res) => {
    const { stock_id } = req.params; // ID du diamant à supprimer

    try {
        const client = await db.connect();
        const queryText = 'DELETE FROM diamants WHERE stock_id = $1 RETURNING stock_id;';
        const result = await client.query(queryText, [stock_id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Diamant non trouvé pour la suppression.' });
        }

        res.status(200).json({ message: `Diamant avec l'ID ${stock_id} supprimé avec succès.`, deleted_id: result.rows[0].stock_id });
    } catch (error) {
        console.error(`Erreur lors de la suppression du diamant ${stock_id} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du diamant.', error: error.message });
    }
};