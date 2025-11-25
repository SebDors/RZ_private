import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '@/services/users';
import type { User } from '@/models/models';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

function ClientDetail() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                const userId = parseInt(id, 10);
                const userData = await getUserById(userId);
                setUser(userData);
            } catch {
                setError('Failed to fetch user details.');
                toast.error('Failed to fetch user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="p-4 bg-secondary rounded-md h-full">
            <Card>
                <CardHeader>
                    <CardTitle>{user.first_name} {user.last_name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div>
                        <h3 className="font-semibold">Company</h3>
                        <p>{user.company_name}</p>
                        <p>{user.company_address}, {user.company_city}, {user.company_zip_code}, {user.company_country}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Contact</h3>
                        <p>Email: {user.company_email}</p>
                        <p>Phone: {user.phone_number}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Account Status</h3>
                        <p>{user.is_active ? 'Active' : 'Inactive'}</p>
                        <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Documents</h3>
                        <p>ID Document: {user.id_document_url ? <a href={user.id_document_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View</a> : 'Not provided'}</p>
                        <p>Business Registration: {user.business_registration_url ? <a href={user.business_registration_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View</a> : 'Not provided'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ClientDetail;
