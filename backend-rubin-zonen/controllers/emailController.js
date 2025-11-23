const { apiInstance } = require('../services/emailService');

// TODO: Ajouter la lisaison avec la BDD
const sendEmail = async (to, subject, textContent) => {
    if (!to || !subject || !textContent) {
        throw new Error('The `to`, `subject`, and `textContent` fields are required.');
    }

    let sendSmtpEmail = {
        to: [{ email: to }],
        subject: subject,
        textContent: textContent,
        sender: { name: 'Rubin & Zonen', email: process.env.BREVO_EMAIL_SENDER },
    };

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return data; // Returns data for potential future use
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error; // Rethrow the error so the caller can handle it
    }
};

exports.sendEmail = sendEmail;

// Example function to send a test email
// TODO: test with client info
exports.sendTestEmail = async (req, res) => {
    const { to, subject, textContent } = req.body;

    if (!to || !subject || !textContent) {
        return res.status(400).json({ message: 'The `to`, `subject`, and `textContent` fields are required.' });
    }

    try {
        await sendEmail(to, subject, textContent);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email.', error: error.message });
    }
};