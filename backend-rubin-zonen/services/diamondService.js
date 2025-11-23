const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/db');
const { addLog } = require('../controllers/logController');

/**
 * Processes a CSV file of diamonds and updates the database.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<{success: boolean, message: string, count: number, error?: any}>}
 */
async function processDiamondCsv(filePath) {
    const diamonds = [];
    const client = await db.connect();

    try {
        const headerMapping = {
            'Stock #': 'stock_id',
            'Availability': 'availability',
            'Shape': 'shape',
            'Weight': 'weight',
            'Color': 'color',
            'Clarity': 'clarity',
            'Cut Grade': 'cut_grade',
            'Polish': 'polish',
            'Symmetry': 'symmetry',
            'Fluorescence Intensity': 'fluorescence_intensity',
            'Fluorescence Color': 'fluorescence_color',
            'Measurements': 'measurements',
            'Lab': 'lab',
            'Certificate #': 'certificate_number',
            'Treatment': 'treatment',
            'PriceCarat': 'price_carat',
            'Fancy Color': 'fancy_color',
            'Fancy Color Intensity': 'fancy_color_intensity',
            'Fancy Color Overtone': 'fancy_color_overtone',
            'Depth %': 'depth_pct',
            'Table %': 'table_pct',
            'Girdle Thin': 'girdle_thin',
            'Girdle Thick': 'girdle_thick',
            'Girdle %': 'girdle_pct',
            'Girdle Condition': 'girdle_condition',
            'Culet Size': 'culet_size',
            'Culet Condition': 'culet_condition',
            'Crown Height': 'crown_height',
            'Crown Angle': 'crown_angle',
            'Pavilion Depth': 'pavilion_depth',
            'Pavilion Angle': 'pavilion_angle',
            'Laser Inscription': 'laser_inscription',
            'Comment': 'comment',
            'Country': 'country',
            'State': 'state',
            'City': 'city',
            'Is Matched Pair Separable': 'is_matched_pair_separable',
            'Pair Stock #': 'pair_stock_id',
            'Allow RapLink Feed': 'allow_raplink_feed',
            'Parcel Stones': 'parcel_stones',
            'Certificate Filename': 'certificate_filename',
            'Diamond Image': 'diamond_image',
            '3D File': '"3d_file"',
            'Trade Show': 'trade_show',
            'Member comments': 'member_comments',
            'rap': 'rap',
            'Disc': 'disc',
            'VideoFile': 'video_file',
            'ImageFile': 'image_file',
            'CertificateFile': 'certificate_file'
        };
        const allDbColumns = Object.values(headerMapping);

        await new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);
            const csvStream = stream.pipe(csv({
                mapHeaders: ({ header }) => headerMapping[header.trim()] || header.trim(),
                removeBOM: true,
                separator: ',',
            }));

            csvStream.once('headers', (headers) => {
                const fileHeaders = headers.map(h => h.trim());
                const extraHeaders = fileHeaders.filter(header => !allDbColumns.includes(header));

                if (extraHeaders.length > 0) {
                    const error = new Error(`Invalid CSV format. Unknown columns found: ${extraHeaders.join(', ')}`);
                    error.isValidationError = true;
                    csvStream.emit('error', error);
                }
            });

            csvStream.on('data', (row) => {
                const sanitizedRow = {};
                for (const key in row) {
                    const dbColumn = key;
                    if (dbColumn && allDbColumns.includes(dbColumn)) {
                        let value = row[key];
                        if (value === '' || value === 'NULL' || value === undefined) {
                            sanitizedRow[dbColumn] = null;
                        } else if (typeof value === 'string') {
                            const lowerValue = value.toLowerCase();
                            if (lowerValue === 'true') {
                                sanitizedRow[dbColumn] = true;
                            } else if (lowerValue === 'false') {
                                sanitizedRow[dbColumn] = false;
                            } else {
                                sanitizedRow[dbColumn] = value;
                            }
                        } else {
                            sanitizedRow[dbColumn] = value;
                        }
                    }
                }
                diamonds.push(sanitizedRow);
            });

            csvStream.on('end', () => {
                if (diamonds.length === 0) {
                    const error = new Error('The file does not contain any diamond data.');
                    error.isValidationError = true;
                    return reject(error);
                }
                resolve();
            });

            stream.on('error', reject);
            csvStream.on('error', reject);
        });

        await client.query('BEGIN');
        await client.query('DELETE FROM diamants');

        for (const diamond of diamonds) {
            const columns = Object.keys(diamond).filter(k => diamond[k] !== null && diamond[k] !== undefined);
            const values = columns.map(k => diamond[k]);
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
            
            const columnNames = columns.join(', ');

            if(columns.length > 0) {
                const queryText = `INSERT INTO diamants (${columnNames}) VALUES (${placeholders})`;
                await client.query(queryText, values);
            }
        }

        await client.query('COMMIT');
        
        await addLog({
            level: 'info',
            action: 'DIAMOND_CSV_IMPORT_SUCCESS',
            details: { message: `Successfully imported ${diamonds.length} diamonds.`, file: filePath },
        });

        return { success: true, message: `Successfully imported ${diamonds.length} diamonds.`, count: diamonds.length };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during CSV processing:', error);
        
        await addLog({
            level: 'error',
            action: 'DIAMOND_CSV_IMPORT_FAILED',
            details: { file: filePath, error: error.message },
        });

        return { success: false, message: 'Error processing file.', error: error, count: 0 };
    } finally {
        client.release();
        // The file should be deleted by the calling function (controller or cron job)
    }
}

module.exports = {
    processDiamondCsv,
};
