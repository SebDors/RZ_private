import ClientCard from "../../components/Users/UserCard"
import { useState } from "react";

function Clients() {
    const [searchQuery, setSearchQuery] = useState("");

    const clients = [ //Mock data
        { id: 0, companyName: "Example Corp 1", active: true, contactName: "John Doe", phoneNumber: "1234567890" },
        { id: 1, companyName: "Example Corp 2", active: false, contactName: "John Doe", phoneNumber: "1234567890" },
        { id: 2, companyName: "Example Corp 3", active: true, contactName: "John Doe" }
    ];

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
                {clients.map(client => (// .map iterates over the clients array and creates a ClientCard for each client
                    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) && <ClientCard client={client} key={client.id} />
                ))}
            </div>
        </div>
    );
}

export default Clients