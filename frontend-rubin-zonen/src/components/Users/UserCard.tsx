// used to display a client card with client information in the admin panel

function ClientCard({ client }) {

    function onClientClick() {
        console.log("Client ID: " + client.id + " clicked");
        client.active = !client.active;
    }

    return <div className="client-card">
        <button className="client-card" onClick={onClientClick}>
            <div className="card-header">
                <div className="company-info">
                    <span className="company-name">{client.companyName}</span>
                    {client.active ? ( // if client is active, show a green dot, else show a red dot
                        <span className="active-dot"> ACTIVE</span>
                    ) : (
                        <span className="inactive-dot"> INACTIVE</span>
                    )}

                </div>
            </div>
            <div className="card-body">
                {client.contactName && client.phoneNumber ? ( // if contactName and phoneNumber are defined, show them
                    <span className="contact-info">{`${client.contactName} | ${client.phoneNumber}`}</span>
                ) : (
                    <span className="contact-info">-</span>
                )}
            </div>
        </button>
    </div>
}

export default ClientCard;