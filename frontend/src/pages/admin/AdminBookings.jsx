import { useEffect, useState } from "react"
import api from "../../services/api"

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const formatTravelDate = (value) => {
    if (!value) return "-"
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
  }

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
    fetchBookings(true)

    const intervalId = setInterval(() => {
      fetchBookings(false)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchBookings = async (showLoader = true) => {
    if (showLoader) setLoading(true)

    try {
      const res = await api.get("/admin/pendingBookings")
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  const approveBooking = async (id) => {
    const previous = bookings
    setBookings((prev) => prev.filter((b) => b.id !== id))

    try {
      await api.put(`/admin/approve/${id}`)
    } catch {
      setBookings(previous)
      alert("Approval failed")
    }
  }

  const rejectBooking = async (id) => {
    const previous = bookings
    setBookings((prev) => prev.filter((b) => b.id !== id))

    try {
      await api.put(`/admin/reject/${id}`)
    } catch {
      setBookings(previous)
      alert("Rejection failed")
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
            <h1>Pending Bookings</h1>
            <p>Review and manage pending booking requests.</p>
          </div>
        </div>

        <div className="admin-page-content">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>No Pending Bookings</h3>
              <p>All bookings have been processed</p>
            </div>
          ) : (
            <div className="admin-card admin-table-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Pending Booking Requests</h3>
              </div>

              <div className="admin-table-wrap admin-desktop-table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Bus</th>
                      <th>Passenger</th>
                      <th>Seat</th>
                      <th>Age / Gender</th>
                      <th>Phone</th>
                      <th>Booked By</th>
                      <th>UTR</th>
                      <th>Travel Date</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td>#{b.id}</td>
                        <td>{b.bus?.busName || "-"}</td>
                        <td>{normalizeName(b.passengerName) || "Unknown"}</td>
                        <td>{b.seatNumber}</td>
                        <td>{b.passengerAge || "-"} / {b.passengerGender || "-"}</td>
                        <td>{b.passengerPhone || "No phone"}</td>
                        <td>{normalizeName(b.user?.name)}</td>
                        <td>{b.utrNumber ? <span className="utr-chip">{b.utrNumber}</span> : "-"}</td>
                        <td>{formatTravelDate(b.travelDate)}</td>
                        <td><span className="booking-card-amount">Rs.{b.amount}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn approve" onClick={() => approveBooking(b.id)} type="button">Approve</button>
                            <button className="action-btn reject" onClick={() => rejectBooking(b.id)} type="button">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-mobile-bus-list">
                {bookings.map((b) => (
                  <div key={b.id} className="admin-item-card admin-mobile-data-card">
                    <div className="admin-item-card-header">
                      <div>
                        <div className="admin-item-card-title">{normalizeName(b.passengerName) || "Unknown"}</div>
                        <span className="admin-item-card-id">Booking #{b.id}</span>
                      </div>
                      <span className="booking-card-amount">Rs.{b.amount}</span>
                    </div>

                    <div className="admin-item-card-body">
                      <div className="admin-item-row">
                        <span className="admin-item-label">Bus</span>
                        <span className="admin-item-value">{b.bus?.busName || "-"}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Seat</span>
                        <span className="admin-item-value">{b.seatNumber}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Age / Gender</span>
                        <span className="admin-item-value">{b.passengerAge || "-"} / {b.passengerGender || "-"}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Phone</span>
                        <span className="admin-item-value">{b.passengerPhone || "No phone"}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Booked By</span>
                        <span className="admin-item-value">{normalizeName(b.user?.name)}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">UTR</span>
                        <span className="admin-item-value">{b.utrNumber ? <span className="utr-chip">{b.utrNumber}</span> : "-"}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Travel Date</span>
                        <span className="admin-item-value">{formatTravelDate(b.travelDate)}</span>
                      </div>
                    </div>

                    <div className="admin-item-card-actions">
                      <button className="action-btn approve" onClick={() => approveBooking(b.id)} type="button">Approve</button>
                      <button className="action-btn reject" onClick={() => rejectBooking(b.id)} type="button">Reject</button>
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

export default AdminBookings
