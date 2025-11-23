const db = require('../config/db');
const { addLog } = require('./logController');

exports.getEmailTemplates = async (req, res) => {
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM email_templates ORDER BY id');
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching email templates:', error);
        res.status(500).json({ message: 'Server error while fetching email templates.' });
    }
};

exports.getEmailTemplateById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await db.connect();
        const result = await client.query('SELECT * FROM email_templates WHERE id = $1', [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Email template not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Error fetching email template ${id}:`, error);
        res.status(500).json({ message: 'Server error while fetching email template.' });
    }
};

exports.updateEmailTemplate = async (req, res) => {
    const { id } = req.params;
    const { subject, body } = req.body;
    const userId = req.user.id;

    if (!subject && !body) {
        return res.status(400).json({ message: 'Subject or body must be provided to update.' });
    }

    try {
        const client = await db.connect();
        
        const currentTemplateResult = await client.query('SELECT * FROM email_templates WHERE id = $1', [id]);
        if (currentTemplateResult.rows.length === 0) {
            client.release();
            return res.status(404).json({ message: 'Email template not found.' });
        }
        const currentTemplate = currentTemplateResult.rows[0];

        const newSubject = subject || currentTemplate.subject;
        const newBody = body || currentTemplate.body;

        const result = await client.query(
            'UPDATE email_templates SET subject = $1, body = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [newSubject, newBody, id]
        );
        client.release();

        const updatedTemplate = result.rows[0];

        await addLog({
            userId: userId,
            level: 'info',
            action: 'EMAIL_TEMPLATE_UPDATED',
            details: {
                template_id: id,
                changes: {
                    old_subject: currentTemplate.subject,
                    new_subject: updatedTemplate.subject,
                    old_body: currentTemplate.body,
                    new_body: updatedTemplate.body
                }
            }
        });

        res.status(200).json(updatedTemplate);
    } catch (error) {
        console.error(`Error updating email template ${id}:`, error);
        await addLog({
            userId: userId,
            level: 'error',
            action: 'EMAIL_TEMPLATE_UPDATE_FAILED',
            details: { template_id: id, error: error.message }
        });
        res.status(500).json({ message: 'Server error while updating email template.' });
    }
};
