import { getToken } from "@/lib/utils";
import type { EmailTemplate } from "@/models/models";

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/email-templates`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch email templates.');
    }
    const data = await response.json();
    return data;
};

export const updateEmailTemplate = async (id: number, subject: string, body: string): Promise<EmailTemplate> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/email-templates/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject, body })
    });
    if (!response.ok) {
        throw new Error('Failed to update email template.');
    }
    const data = await response.json();
    return data;
};
