const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const { addLog } = require("../controllers/logController");
const { processDiamondCsv } = require("./diamondService");

// Configuration for the FTP connection
const ftpConfig = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: false, // Set to true for FTPS
};

// The path to the file on the FTP server
// TODO: This should be configurable, maybe from .env
const remoteFilePath = "/remote/path/to/diamonds.csv"; 

// The local path to save the downloaded file
const localDir = path.join(__dirname, '..', 'uploads');
const localFilePath = path.join(localDir, 'diamonds_from_ftp.csv');

/**
 * Downloads a diamond CSV from an FTP server, processes it, and cleans up.
 */
async function downloadAndProcessDiamonds() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable verbose logging for debugging

    try {
        console.log("Starting FTP download process...");
        await addLog({
            level: 'info',
            action: 'FTP_JOB_START',
            details: { message: 'Attempting to connect to FTP server.' }
        });
        
        await client.access(ftpConfig);

        console.log("FTP Connected. Downloading file...");
        await addLog({
            level: 'info',
            action: 'FTP_CONNECT_SUCCESS',
            details: { host: ftpConfig.host }
        });

        // Ensure the 'uploads' directory exists
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir, { recursive: true });
        }
        
        // Download the file
        await client.downloadTo(localFilePath, remoteFilePath);
        console.log(`File downloaded to ${localFilePath}`);
        await addLog({
            level: 'info',
            action: 'FTP_DOWNLOAD_SUCCESS',
            details: { remoteFile: remoteFilePath, localFile: localFilePath }
        });

    } catch (error) {
        console.error("FTP process failed:", error);
        await addLog({
            level: 'error',
            action: 'FTP_PROCESS_FAILED',
            details: { error: error.message, stage: 'Connection or Download' }
        });
        return; // Stop the process if FTP fails
    } finally {
        if (client.closed === false) {
            client.close();
            console.log("FTP connection closed.");
        }
    }

    try {
        // Process the downloaded CSV file
        console.log("Processing downloaded CSV file...");
        await addLog({
            level: 'info',
            action: 'FTP_CSV_PROCESSING_START',
            details: { localFile: localFilePath }
        });

        const result = await processDiamondCsv(localFilePath);

        if (result.success) {
            console.log(`CSV processing successful: ${result.message}`);
        } else {
            console.error(`CSV processing failed: ${result.message}`);
        }

    } catch (error) {
        console.error("Error during CSV processing after FTP download:", error);
        await addLog({
            level: 'error',
            action: 'FTP_CSV_PROCESSING_FAILED',
            details: { localFile: localFilePath, error: error.message }
        });
    } finally {
        // Clean up the downloaded file
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error(`Error deleting temporary FTP file ${localFilePath}:`, err);
                addLog({
                    level: 'warn',
                    action: 'FTP_CLEANUP_FAILED',
                    details: { localFile: localFilePath, error: err.message }
                });
            } else {
                console.log(`Temporary FTP file ${localFilePath} deleted.`);
            }
        });
    }
}

module.exports = {
    downloadAndProcessDiamonds,
};
