import { useEffect, useState } from "react"
import api from "../../services/api"


function SupportTickets() {

    const [tickets, setTickets] = useState([])
    const [responses, setResponses] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        try {
            const res = await api.get("/ticket/all")
            setTickets(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const respond = async (ticketId) => {
        try {
            const reply = responses[ticketId]
            if (!reply) {
                alert("Please enter response")
                return
            }

            await api.put(`/ticket/respond/${ticketId}`, { response: reply })
            alert("Response sent successfully")
            setResponses({ ...responses, [ticketId]: "" })
            fetchTickets()
        } catch (err) {
            alert("Failed to send response")
        }
    }

    if (loading) {
        return <div className="admin-page"><div className="loading-state"><div className="loading-spinner"></div></div></div>
    }

    return (
        <div className="admin-page">
            <div className="admin-page-container">
                <div className="admin-page-header">
                    <div className="admin-page-header-left">
                        <h1>Support Tickets</h1>
                        <p>Manage customer support requests and respond to tickets.</p>
                    </div>
                </div>
                
                <div className="admin-page-content">
                    <div className="admin-card">
                        {tickets.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3>No Support Tickets</h3>
                        <p>All tickets have been resolved</p>
                    </div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table mobile-card-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Response</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(t => (
                                    <tr key={t.id}>
                                        <td data-label="User"><strong>{t.user?.name}</strong></td>
                                        <td data-label="Subject">{t.subject}</td>
                                        <td data-label="Message" className="support-message-cell">{t.message}</td>
                                        <td data-label="Status">
                                            <span className={`status-badge ${t.status?.toLowerCase()}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td data-label="Response" className="support-response-cell">
                                            {t.adminResponse ? (
                                                <div className="support-response-box">
                                                    <strong>Response:</strong> {t.adminResponse}
                                                </div>
                                            ) : (
                                                <div className="support-response-form">
                                                    <input
                                                        className="support-response-input"
                                                        placeholder="Type response..."
                                                        value={responses[t.id] || ""}
                                                        onChange={(e) => setResponses({ ...responses, [t.id]: e.target.value })}
                                                    />
                                                    <button 
                                                        className="action-btn approve"
                                                        onClick={() => respond(t.id)}
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                </div>
                </div>
            </div>
        </div>
    )
}

export default SupportTickets
