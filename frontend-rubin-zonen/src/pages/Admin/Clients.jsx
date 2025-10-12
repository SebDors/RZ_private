import ClientCard from "../../components/Users/UserCard"
import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/api";

function Clients() {
    const [searchQuery, setSearchQuery] = useState(""); // State for the search input
    const [users, setUsers] = useState([]); // State to hold fetched users
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State to manage error

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const users = await getAllUsers()
                setUsers(users)
            } catch (err) {
                setError("Failed to fetch users")
                console.log("Error fetching users : ", err)
            } finally {
                setLoading(false)
            }
        }

        fetchAllUsers()
    }, []); // Empty useEffect to fetch user only one time (useEffect runs when the array changes)

    const handleSearch = () => {
        console.log("Search for:" + searchQuery)
        //TODO implement function for filters
    }

    return (
        <div className="clients-page">
            <form className="search-form" >
                {/* TODO make the text (Search ...) a variable */}
                <input type="text"
                    placeholder="Search ..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} />
            </form>

            <div className="clients-list">
                {users.map(client => (// .map iterates over the clients array and creates a ClientCard for each client
                    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) && <ClientCard client={client} key={client.id} />
                ))}
            </div>
        </div>
    );
}

export default Clients