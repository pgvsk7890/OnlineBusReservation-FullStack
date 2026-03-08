import { useEffect, useState } from "react"
import api from "../../services/api"

function BookingHistory() {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

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
                    <div className="admin-card">
                        {bookings.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <h3>No Bookings Yet</h3>
                        <p>Booking history will appear here</p>
                    </div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table mobile-card-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Passenger</th>
                                    <th>Bus</th>
                                    <th>Seat</th>
                                    <th>UTR</th>
                                    <th>Amount</th>
                                    <th>Booking Status</th>
                                    <th>Payment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id}>
                                        <td data-label="ID">#{b.id}</td>
                                        <td data-label="Passenger">
                                            <div>{b.passengerName || "-"}</div>
                                            <small>Age: {b.passengerAge || "-"}</small>
                                            <small>Gender: {b.passengerGender || "-"}</small>
                                            <small>Phone: {b.passengerPhone || "No phone"}</small>
                                            <small>Booked By: {b.user?.name || "-"}</small>
                                        </td>
                                        <td data-label="Bus">{b.bus?.busName}</td>
                                        <td data-label="Seat">{b.seatNumber}</td>
                                        <td data-label="UTR">
                                            <span className="utr-chip">{b.utrNumber || "-"}</span>
                                        </td>
                                        <td data-label="Amount">Rs.{b.amount}</td>
                                        <td data-label="Booking Status">
                                            <span className={`status-badge ${b.bookingStatus?.toLowerCase()}`}>
                                                {b.bookingStatus}
                                            </span>
                                        </td>
                                        <td data-label="Payment Status">
                                            <span className={`status-badge ${b.paymentStatus?.toLowerCase()}`}>
                                                {b.paymentStatus}
                                            </span>
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

export default BookingHistory
