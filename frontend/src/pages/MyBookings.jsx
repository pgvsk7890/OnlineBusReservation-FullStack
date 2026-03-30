import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const formatTravelDate = (value) => {
    if (!value) return "-"
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
  }

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchBookings(true)

    const intervalId = setInterval(() => {
      fetchBookings(false)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchBookings = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true)
    }

    try {
      const res = await api.get(`/booking/user/${user.id}`)

      const validBookings = res.data.filter((booking) => booking?.bus || booking?.seat)
      setBookings(validBookings)
    } catch (err) {
      console.log(err)
      if (showLoader) {
        alert("Failed to load bookings")
      }
    } finally {
      if (showLoader) {
        setLoading(false)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "BOOKED":
      case "CONFIRMED":
      case "COMPLETED":
        return { bg: "rgba(17, 150, 105, 0.15)", color: "#119669", label: "Booked" }
      case "PENDING":
      case "PROCESSING":
        return { bg: "rgba(209, 138, 0, 0.15)", color: "#d18a00", label: "Pending" }
      case "CANCELLED":
      case "FAILED":
      case "REJECTED":
        return { bg: "rgba(214, 69, 69, 0.15)", color: "#d64545", label: "Cancelled" }
      default:
        return { bg: "rgba(96, 112, 138, 0.15)", color: "#60708a", label: status || "Unknown" }
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID":
      case "SUCCESS":
        return { bg: "rgba(17, 150, 105, 0.15)", color: "#119669" }
      case "PENDING":
        return { bg: "rgba(209, 138, 0, 0.15)", color: "#d18a00" }
      case "FAILED":
        return { bg: "rgba(214, 69, 69, 0.15)", color: "#d64545" }
      default:
        return { bg: "rgba(96, 112, 138, 0.15)", color: "#60708a" }
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true
    if (activeTab === "booked") {
      const status = booking.bookingStatus?.toUpperCase()
      return status === "BOOKED" || status === "CONFIRMED" || status === "COMPLETED" || status === "SUCCESS"
    }
    if (activeTab === "pending") {
      const status = booking.bookingStatus?.toUpperCase()
      return status === "PENDING" || status === "PROCESSING"
    }
    if (activeTab === "cancelled") {
      const status = booking.bookingStatus?.toUpperCase()
      return status === "CANCELLED" || status === "FAILED" || status === "REJECTED"
    }
    return true
  })

  const stats = {
    total: bookings.length,
    booked: bookings.filter(b => {
      const status = b.bookingStatus?.toUpperCase()
      return status === "BOOKED" || status === "CONFIRMED" || status === "COMPLETED" || status === "SUCCESS"
    }).length,
    pending: bookings.filter(b => {
      const status = b.bookingStatus?.toUpperCase()
      return status === "PENDING" || status === "PROCESSING"
    }).length,
    cancelled: bookings.filter(b => {
      const status = b.bookingStatus?.toUpperCase()
      return status === "CANCELLED" || status === "FAILED" || status === "REJECTED"
    }).length,
  }

  return (
    <div className="mybookings-page">
      <div className="bookings-hero">
        <div className="hero-content">
          <h1>My Bookings</h1>
          <p>View and manage all your bus bookings</p>
        </div>
      </div>

      <div className="bookings-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon confirmed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.booked}</span>
            <span className="stat-label">Booked</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      <div className="bookings-tabs">
        <button 
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button 
          className={`tab-btn ${activeTab === "booked" ? "active" : ""}`}
          onClick={() => setActiveTab("booked")}
        >
          Booked
        </button>
        <button 
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button 
          className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Loading your bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3>No Bookings Found</h3>
          <p>You haven't made any bookings yet</p>
          <Link to="/home" className="primary-btn">
            Book Now
          </Link>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => {
            const seat = booking.seat
            const bus = booking.bus || seat?.bus
            const statusStyle = getStatusColor(booking.bookingStatus)
            const paymentStyle = getPaymentStatusColor(booking.paymentStatus)

            if (!bus) {
              return null
            }

            return (
              <div className="booking-card" key={booking.id}>
                <div className="booking-card-header">
                  <div className="bus-info">
                    <h3>{bus.busName}</h3>
                    <span className="bus-number">{bus.busNumber}</span>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                <div className="booking-route">
                  <div className="route-point">
                    <div className="route-dot"></div>
                    <div className="route-info">
                      <span className="route-time">{bus.departureTime}</span>
                      <span className="route-city">{bus.fromCity}</span>
                    </div>
                  </div>
                  <div className="route-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                  <div className="route-point">
                    <div className="route-dot end"></div>
                    <div className="route-info">
                      <span className="route-time">{bus.arrivalTime}</span>
                      <span className="route-city">{bus.toCity}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Passenger</span>
                    <span className="detail-value">{booking.passengerName || user?.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Seat</span>
                    <span className="detail-value">{booking.seatNumber || seat?.seatNumber || "-"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Travel Date</span>
                    <span className="detail-value">{formatTravelDate(booking.travelDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment</span>
                    <span 
                      className="detail-value payment-status"
                      style={{ background: paymentStyle.bg, color: paymentStyle.color }}
                    >
                      {booking.paymentStatus || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="booking-card-footer">
                  <div className="price-info">
                    <span className="price-label">Total Amount</span>
                    <span className="price-value">Rs.{booking.amount ?? seat?.price ?? "-"}</span>
                  </div>
                  {booking.bookingStatus?.toUpperCase() === "CONFIRMED" && (
                    <Link to="/home" className="book-again-btn">
                      Book Again
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyBookings
