const { apiInstance } = require('../services/emailService');
const db = require('../config/db');
const { addLog } = require('./logController');

const sendCustomEmail = async (to, subject, textContent) => {
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
        return data;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

const sendTemplateEmail = async (userId, template_name, data = {}) => {
    const client = await db.connect();
    try {
        // Fetch user email
        const userResult = await client.query('SELECT email FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            // Log this error but don't throw, as it might be a non-critical email
            console.error(`User with ID '${userId}' not found for sending email.`);
            await addLog({
                userId: userId,
                level: 'error',
                action: `SEND_${template_name.toUpperCase()}_EMAIL_FAILED`,
                details: { reason: `User with ID ${userId} not found.` }
            });
            return; 
        }
        const user = userResult.rows[0];
        const to = user.email;

        // Fetch email template
        const templateResult = await client.query('SELECT * FROM email_templates WHERE template_name = $1', [template_name]);
        if (templateResult.rows.length === 0) {
            throw new Error(`Email template '${template_name}' not found.`);
        }

        const template = templateResult.rows[0];
        let { subject, body } = template;

        // Replace placeholders
        for (const key in data) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            subject = subject.replace(regex, data[key]);
            body = body.replace(regex, data[key]);
        }
        
        try {
            await sendCustomEmail(to, subject, body);
            await addLog({
                userId: userId,
                level: 'info',
                action: `SEND_${template_name.toUpperCase()}_EMAIL_SUCCESS`,
                details: { email: to }
            });
        } catch (emailError) {
            console.error(`Failed to send ${template_name} email:`, emailError);
            await addLog({
                userId: userId,
                level: 'error',
                action: `SEND_${template_name.toUpperCase()}_EMAIL_FAILED`,
                details: { email: to, error: emailError.message }
            });
        }

    } catch (error) {
        console.error('Error preparing to send template email:', error);
        await addLog({
            userId: userId,
            level: 'error',
            action: `PREPARE_EMAIL_${template_name.toUpperCase()}_FAILED`,
            details: { error: error.message }
        });
    }
    finally {
        client.release();
    }
};


exports.sendCustomEmail = sendCustomEmail;
exports.sendTemplateEmail = sendTemplateEmail;