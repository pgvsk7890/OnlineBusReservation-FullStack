import { useEffect, useState } from "react"
import api from "../../services/api"

function BookingHistory() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [busFilter, setBusFilter] = useState("")
  const [passengerFilter, setPassengerFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

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

  const toDateKey = (value) => {
    if (!value) return ""
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return ""
    const year = parsed.getFullYear()
    const month = String(parsed.getMonth() + 1).padStart(2, "0")
    const day = String(parsed.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const filteredBookings = bookings.filter((b) => {
    const busName = (b.bus?.busName || "").toLowerCase()
    const passengerName = normalizeName(b.passengerName || "").toLowerCase()
    const busMatch = busName.includes(busFilter.trim().toLowerCase())
    const passengerMatch = passengerName.includes(passengerFilter.trim().toLowerCase())
    const dateMatch = dateFilter ? toDateKey(b.travelDate) === dateFilter : true
    return busMatch && passengerMatch && dateMatch
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await api.get("/booking/all")
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
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
            <h1>Booking History</h1>
            <p>View all past and current bookings.</p>
          </div>
        </div>

        <div className="admin-page-content">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>No Bookings Yet</h3>
              <p>Booking history will appear here</p>
            </div>
          ) : (
            <div className="admin-card admin-table-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">All Bookings</h3>
              </div>

              <div className="table-filters">
                <div className="table-filter">
                  <label>Bus name</label>
                  <input
                    type="text"
                    value={busFilter}
                    onChange={(e) => setBusFilter(e.target.value)}
                    placeholder="Search by bus name"
                  />
                </div>
                <div className="table-filter">
                  <label>Passenger name</label>
                  <input
                    type="text"
                    value={passengerFilter}
                    onChange={(e) => setPassengerFilter(e.target.value)}
                    placeholder="Search by passenger"
                  />
                </div>
                <div className="table-filter">
                  <label>Travel date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => {
                    setBusFilter("")
                    setPassengerFilter("")
                    setDateFilter("")
                  }}
                >
                  Clear
                </button>
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
                      <th>Booking</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id}>
                        <td>#{b.id}</td>
                        <td>{b.bus?.busName || "-"}</td>
                        <td>{normalizeName(b.passengerName) || "Unknown"}</td>
                        <td>{b.seatNumber}</td>
                        <td>{b.passengerAge || "-"} / {b.passengerGender || "-"}</td>
                        <td>{b.passengerPhone || "-"}</td>
                        <td>{normalizeName(b.user?.name)}</td>
                        <td>{b.utrNumber ? <span className="utr-chip">{b.utrNumber}</span> : "-"}</td>
                        <td>{formatTravelDate(b.travelDate)}</td>
                        <td><span className="booking-card-amount">Rs.{b.amount}</span></td>
                        <td><span className={`status-badge ${b.bookingStatus?.toLowerCase()}`}>{b.bookingStatus}</span></td>
                        <td><span className={`status-badge ${b.paymentStatus?.toLowerCase()}`}>{b.paymentStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-mobile-bus-list">
                {filteredBookings.map((b) => (
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
                        <span className="admin-item-value">{b.passengerPhone || "-"}</span>
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
                      <div className="admin-item-row">
                        <span className="admin-item-label">Booking</span>
                        <span className="admin-item-value">
                          <span className={`status-badge ${b.bookingStatus?.toLowerCase()}`}>{b.bookingStatus}</span>
                        </span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Payment</span>
                        <span className="admin-item-value">
                          <span className={`status-badge ${b.paymentStatus?.toLowerCase()}`}>{b.paymentStatus}</span>
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

export default BookingHistory
