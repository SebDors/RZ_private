import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/api.ts";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Clients() {
    const [searchQuery, setSearchQuery] = useState(""); // State for the search input
    const [users, setUsers] = useState([]); // State to hold fetched users
    // const [loading, setLoading] = useState(true); // State to manage loading status
    // const [error, setError] = useState(null); // State to manage error

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const users = await getAllUsers()
                setUsers(users)
            } catch (err) {
                // setError("Failed to fetch users")
                console.log("Error fetching users : ", err)
            } finally {
                // setLoading(false)
            }
        }

        fetchAllUsers()
    }, []); // Empty useEffect to fetch user only one time (useEffect runs when the array changes)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Input 
                    type="text"
                    placeholder="Search ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />

                <div className="clients-list mt-4 grid gap-4">
                    {users.map(client => (
                        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) && 
                        <Card key={client.id}>
                            <CardHeader>
                                <CardTitle>{client.companyName}</CardTitle>
                                <CardDescription>{client.email}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{client.firstName} {client.lastName}</p>
                                <p>{client.address}, {client.city}, {client.zipCode}, {client.country}</p>
                                <p>{client.phoneNumber}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Clients