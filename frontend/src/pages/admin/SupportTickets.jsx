import { useEffect, useState } from "react"
import api from "../../services/api"

function SupportTickets() {
  const [tickets, setTickets] = useState([])
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)

  const normalizeName = (value) => {
    if (!value) return "-"
    const trimmed = String(value).trim()
    const words = trimmed.split(/\s+/)
    if (words.length % 2 === 0) {
      const half = words.length / 2
      const first = words.slice(0, half).join(" ")
      const second = words.slice(half).join(" ")
      if (first.toLowerCase() === second.toLowerCase()) return first
    }
    return trimmed
  }

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
    } catch {
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
          {tickets.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>No Support Tickets</h3>
              <p>All tickets have been resolved</p>
            </div>
          ) : (
            <div className="admin-card admin-table-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Customer Support Queue</h3>
              </div>

              <div className="admin-table-wrap admin-desktop-table">
                <table className="admin-table">
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
                    {tickets.map((t) => (
                      <tr key={t.id}>
                        <td>{normalizeName(t.user?.name)}</td>
                        <td>{t.subject}</td>
                        <td className="admin-message-cell">{t.message}</td>
                        <td>
                          <span className={`status-badge ${t.status?.toLowerCase()}`}>{t.status}</span>
                        </td>
                        <td className="admin-response-cell">
                          {t.adminResponse ? (
                            <div className="admin-response table-response">
                              <strong>Response</strong>
                              <p>{t.adminResponse}</p>
                            </div>
                          ) : (
                            <div className="table-response-form">
                              <textarea
                                className="support-response-input"
                                placeholder="Type response..."
                                value={responses[t.id] || ""}
                                onChange={(e) => setResponses({ ...responses, [t.id]: e.target.value })}
                              />
                              <button className="action-btn approve" onClick={() => respond(t.id)} type="button">
                                Send Response
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-mobile-bus-list">
                {tickets.map((t) => (
                  <div key={t.id} className="admin-item-card admin-mobile-data-card">
                    <div className="admin-item-card-header">
                      <div>
                        <div className="admin-item-card-title">{t.subject}</div>
                        <span className="admin-item-card-id">{normalizeName(t.user?.name)}</span>
                      </div>
                      <span className={`status-badge ${t.status?.toLowerCase()}`}>{t.status}</span>
                    </div>

                    <div className="admin-item-card-body">
                      <div className="admin-item-row">
                        <span className="admin-item-label">User</span>
                        <span className="admin-item-value">{normalizeName(t.user?.name)}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Message</span>
                        <span className="admin-item-value">{t.message}</span>
                      </div>
                      <div className="admin-item-row admin-response-row">
                        <span className="admin-item-label">Response</span>
                        <span className="admin-item-value admin-ticket-response-value">
                          {t.adminResponse ? (
                            <div className="admin-response table-response">
                              <strong>Response</strong>
                              <p>{t.adminResponse}</p>
                            </div>
                          ) : (
                            <div className="table-response-form">
                              <textarea
                                className="support-response-input"
                                placeholder="Type response..."
                                value={responses[t.id] || ""}
                                onChange={(e) => setResponses({ ...responses, [t.id]: e.target.value })}
                              />
                              <button className="action-btn approve" onClick={() => respond(t.id)} type="button">
                                Send Response
                              </button>
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupportTickets
