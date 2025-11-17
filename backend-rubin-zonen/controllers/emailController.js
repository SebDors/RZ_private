const { apiInstance } = require('../services/emailService');

// Exemple de fonction pour envoyer un e-mail de test
exports.sendTestEmail = async (req, res) => {
    const { to, subject, textContent } = req.body;

    if (!to || !subject || !textContent) {
        return res.status(400).json({ message: 'Les champs `to`, `subject`, et `textContent` sont requis.' });
    }

    let sendSmtpEmail = {
        to: [{ email: to }],
        subject: subject,
        textContent: textContent,
        // TODO: Remplacer par l'adresse e-mail de Rubin Zonen qu'il a dans son compte dans le .env
        sender: { name: 'Rubin & Zonen', email: process.env.BREVO_EMAIL_SENDER},
    };

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        res.status(200).json({ message: 'E-mail envoyé avec succès!', data });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail.', error: error.message });
    }
}; 