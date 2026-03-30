import { useEffect, useState } from "react"
import api from "../services/api"

function Support() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [tickets, setTickets] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/ticket/user/${user.id}`)
      setTickets(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const createTicket = async (e) => {
    e.preventDefault()

    if (!subject || !message) {
      alert("Please fill all fields")
      return
    }

    setIsSubmitting(true)

    try {
      await api.post(`/ticket/create/${user.id}`, {
        subject,
        message
      })

      setSubject("")
      setMessage("")
      fetchTickets()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.log(err)
      alert("Failed to create ticket")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return { bg: 'rgba(17, 150, 105, 0.15)', color: '#119669', label: 'Resolved' }
      case 'pending':
        return { bg: 'rgba(209, 138, 0, 0.15)', color: '#d18a00', label: 'Pending' }
      case 'closed':
        return { bg: 'rgba(214, 69, 69, 0.15)', color: '#d64545', label: 'Closed' }
      default:
        return { bg: 'rgba(15, 98, 254, 0.15)', color: '#0f62fe', label: 'Open' }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="support-page">
      <div className="support-hero-section">
        <div className="support-hero-content">
          <h1>How can we help?</h1>
          <p>Create a support ticket and our team will get back to you as soon as possible</p>
        </div>
        <div className="support-hero-stats">
          <div className="support-stat">
            <div className="stat-icon open">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-count">{tickets.filter(t => t.status?.toLowerCase() === 'pending').length}</span>
              <span className="stat-text">Open</span>
            </div>
          </div>
          <div className="support-stat">
            <div className="stat-icon resolved">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-count">{tickets.filter(t => t.status?.toLowerCase() === 'resolved').length}</span>
              <span className="stat-text">Resolved</span>
            </div>
          </div>
          <div className="support-stat">
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-count">{tickets.length}</span>
              <span className="stat-text">Total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="support-content-grid">
        <div className="support-form-section">
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h2>Create New Ticket</h2>
                <p>Fill in the details below</p>
              </div>
            </div>

            {showSuccess && (
              <div className="success-toast">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Ticket submitted successfully!
              </div>
            )}

            <form onSubmit={createTicket}>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Brief summary of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="faq-card">
            <h3>Quick Help</h3>
            <div className="faq-list">
              <div className="faq-item">
                <div className="faq-question">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Booking Issues
                </div>
                <p>For booking related problems, check your booking history first</p>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Payment Help
                </div>
                <p>Payment failures are usually resolved within 24 hours</p>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                  </svg>
                  Contact Support
                </div>
                <p>Average response time is 2-4 hours during business hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="support-tickets-section">
          <div className="section-header">
            <h2>Your Tickets</h2>
            <span className="ticket-count">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
          </div>

          {tickets.length === 0 ? (
            <div className="empty-tickets">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>No tickets yet</h3>
              <p>Create your first support ticket above</p>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map((ticket) => {
                const statusStyle = getStatusColor(ticket.status)
                return (
                  <div className="ticket-item" key={ticket.id}>
                    <div className="ticket-header">
                      <div className="ticket-title-row">
                        <h4>{ticket.subject}</h4>
                        <span 
                          className="ticket-status-badge"
                          style={{ background: statusStyle.bg, color: statusStyle.color }}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                      <span className="ticket-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                    
                    <div className="ticket-body">
                      <div className="message user-message">
                        <div className="message-header">
                          <span className="message-sender">You</span>
                        </div>
                        <p>{ticket.message}</p>
                      </div>

                      {ticket.adminResponse && (
                        <div className="message admin-message">
                          <div className="message-header">
                            <span className="message-sender">Support Team</span>
                          </div>
                          <p>{ticket.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Support
