const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const client = await db.connect();

        // Resquest for special stones
        const specialStonesQuery = 'SELECT COUNT(*) FROM diamants WHERE is_special = TRUE AND is_upcoming = FALSE;';
        const specialStonesResult = await client.query(specialStonesQuery);

        // Request for upcoming stones
        const upcomingStonesQuery = 'SELECT COUNT(*) FROM diamants WHERE is_upcoming = TRUE;';
        const upcomingStonesResult = await client.query(upcomingStonesQuery);

        // Request for total available stones (not upcoming)
        const totalStonesQuery = 'SELECT COUNT(*) FROM diamants WHERE is_upcoming = FALSE;';
        const totalStonesResult = await client.query(totalStonesQuery);
        
        client.release();

        const stats = {
            specialStonesCount: parseInt(specialStonesResult.rows[0].count, 10),
            upcomingStonesCount: parseInt(upcomingStonesResult.rows[0].count, 10),
            totalAvailableStones: parseInt(totalStonesResult.rows[0].count, 10)
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats.' });
    }
};