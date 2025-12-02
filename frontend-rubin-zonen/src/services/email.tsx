import { getToken } from "@/lib/utils";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const sendCustomEmail = async (to: string, subject: string, textContent: string): Promise<{ success: boolean, data?: Record<string, unknown>, message?: string }> => {
    const token = getToken();
    const response = await fetch(`${API_URL}/api/email/send-custom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ to, subject, textContent })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send custom email.');
    }
    return data;
};

export const sendTemplateEmail = async (template_name: string, templateData: Record<string, string | number>): Promise<{ success: boolean, message?: string }> => {
    const token = getToken();
    const response = await fetch(`${API_URL}/api/email/send-template`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ template_name: template_name, data: templateData })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send template email.');
    }
    return data;
};
