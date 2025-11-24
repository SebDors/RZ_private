const db = require('../config/db');
const fs = require('fs');
const csv = require('csv-parser');
const { addLog } = require('./logController');
const { downloadAndProcessDiamonds } = require('../services/ftpService');



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

const addCaratRangeFilter = (queryParams, filters, values, paramIndex) => {
    if (queryParams.carat) {
        const caratRanges = queryParams.carat.split(',');
        const rangeConditions = [];
        caratRanges.forEach(range => {
            const [min, max] = range.split('-').map(parseFloat);
            if (!isNaN(min) && !isNaN(max)) {
                rangeConditions.push(`(weight >= $${paramIndex++} AND weight <= $${paramIndex++})`);
                values.push(min, max);
            }
        });
        if (rangeConditions.length > 0) {
            filters.push(`(${rangeConditions.join(' OR ')})`);
        }
    }
    return paramIndex;
};

// function to build the WHERE clause based on query parameters
const buildWhereClause = (queryParams) => {
    const filters = [];
    const values = [];
    let paramIndex = 1;

    paramIndex = addInFilter('shape', queryParams, filters, values, paramIndex);

    paramIndex = addCaratRangeFilter(queryParams, filters, values, paramIndex);

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

// Get all diamonds with optional filters
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
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'INFO',
            action: 'VIEW_DIAMONDS',
            details: { 
                message: "User viewed diamonds with filters.",
                filters: req.query,
                returnedCount: filteredRows.length
            },
        })
        res.status(200).json(result.rows);

    } catch (error) {
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'ERROR',
            action: 'VIEW_DIAMONDS_FAILED',
            details: { 
                message: "Error retrieving diamonds with filters.",
                filters: req.query,
                error: error.message
            },
        });
        console.error('Error retrieving diamonds with filters:', error);
        res.status(500).json({ message: 'Error retrieving diamonds with filters.' });
    }
};

exports.getDiamantById = async (req, res) => {
    const { stock_id } = req.params;
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM diamants WHERE stock_id = $1', [stock_id]);
        client.release();

        if (result.rows.length === 0) {
            await addLog({
                userId: req.user ? req.user.id : undefined,
                level: 'WARN',
                action: 'VIEW_DIAMOND_NOT_FOUND',
                details: {
                    stock_id: stock_id,
                    message: 'Diamond not found.'
                },
            });
            
            return res.status(404).json({ message: 'Diamond not found.' });
        }
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'INFO',
            action: 'VIEW_DIAMOND',
            details: {
                stock_id: stock_id,
                message: 'Diamond retrieved successfully.'
            },
        });

        res.status(200).json(result.rows[0]);
    } catch (error) {
        await addLog({
            userId: req.user ? req.user.id : undefined,
            level: 'ERROR',
            action: 'VIEW_DIAMOND_FAILED',
            details: {
                stock_id: stock_id,
                message: 'Error retrieving diamond.',
                error: error.message
            },
        })
        console.error(`Error retrieving diamond ${stock_id}:`, error);
        res.status(500).json({ message: 'Server error while retrieving diamond.' });
    }
};

const { processDiamondCsv } = require('../services/diamondService');

// ... (keep all other functions as they are)

exports.uploadDiamonds = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;

    try {
        const result = await processDiamondCsv(filePath);

        if (result.success) {
            await addLog({
                userId: req.user.id,
                level: 'info',
                action: 'ADMIN_UPLOAD_DIAMONDS_SUCCESS',
                details: { fileName: req.file.originalname, importedCount: result.count },
            });
            res.status(200).json({ message: result.message });
        } else {
            // The service already logs the detailed error
            if (result.error.isValidationError) {
                return res.status(400).json({ message: result.message });
            }
            res.status(500).json({ message: result.message, error: result.error.message });
        }
    } catch (error) {
        // This will catch any unexpected errors not handled by the service
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_UPLOAD_DIAMONDS_UNEXPECTED_FAILURE',
            details: { fileName: req.file.originalname, error: error.message },
        });
        console.error('Unexpected error in uploadDiamonds controller:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    } finally {
        // Clean up the uploaded file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            }
        });
    }
};

exports.refreshDiamonds = async (req, res) => {
    try {
        await addLog({
            userId: req.user.id,
            level: 'info',
            action: 'ADMIN_REFRESH_DIAMONDS_START',
            details: { message: 'Diamond refresh process started.' },
        });

        // We don't await this because it can be a long process
        downloadAndProcessDiamonds();

        res.status(202).json({ message: 'Diamond refresh process started. This may take a while.' });
    } catch (error) {
        await addLog({
            userId: req.user.id,
            level: 'error',
            action: 'ADMIN_REFRESH_DIAMONDS_FAILURE',
            details: { error: error.message },
        });
        console.error('Error starting diamond refresh process:', error);
        res.status(500).json({ message: 'Failed to start diamond refresh process.' });
    }
};