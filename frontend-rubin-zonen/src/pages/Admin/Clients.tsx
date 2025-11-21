import { useState, useEffect } from "react";
import { getAllUsers, updateUser } from "@/services/users";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { User } from "../../models/models"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function Clients() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchAllUsers = async () => {
        try {
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch {
            setError("Failed to fetch users");
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleToggleActive = async (user: User) => {
        try {
            await updateUser(user.id, { is_active: !user.is_active });
            toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully.`);
            fetchAllUsers(); // Refresh the list
        } catch {
            toast.error(`Failed to ${user.is_active ? 'deactivate' : 'activate'} user.`);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.last_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-8">
            <Input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
            />

            <div className="clients-list grid gap-4">
                {filteredUsers.map(client => (
                    <Card key={client.id} className={!client.is_active ? 'bg-gray-100 dark:bg-gray-700 opacity-70' : ''}>
                        <CardHeader>
                            <CardTitle>{client.company_name}</CardTitle>
                            <CardDescription>{client.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{client.first_name} {client.last_name}</p>
                            <p>{client.company_address}, {client.company_city}, {client.company_zip_code}, {client.company_country}</p>
                            <p>{client.phone_number}</p>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button onClick={() => handleToggleActive(client)}>
                                    {client.is_active ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button variant="outline" onClick={() => navigate(`/admin/clients/${client.id}`)}>View Details</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Clients;