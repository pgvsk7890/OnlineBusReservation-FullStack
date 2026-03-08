import { useEffect, useState } from "react"
import api from "../../services/api"

function AdminBookings() {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
            const res = await api.get("/admin/pendingBookings")
            setBookings(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            if (showLoader) {
                setLoading(false)
            }
        }
    }

    const approveBooking = async (id) => {
        const previous = bookings
        setBookings(prev => prev.filter(b => b.id !== id))

        try {
            await api.put(`/admin/approve/${id}`)
        } catch (err) {
            setBookings(previous)
            alert("Approval failed")
        }
    }

    const rejectBooking = async (id) => {
        const previous = bookings
        setBookings(prev => prev.filter(b => b.id !== id))

        try {
            await api.put(`/admin/reject/${id}`)
        } catch (err) {
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
                    <div className="admin-card">
                        {bookings.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3>No Pending Bookings</h3>
                        <p>All bookings have been processed</p>
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
                                    <th>Status</th>
                                    <th>Actions</th>
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
                                        <td data-label="Status">
                                            <span className={`status-badge ${b.bookingStatus?.toLowerCase()}`}>
                                                {b.bookingStatus}
                                            </span>
                                        </td>
                                        <td data-label="Actions">
                                            <button className="action-btn approve" onClick={() => approveBooking(b.id)}>
                                                Approve
                                            </button>
                                            <button className="action-btn reject" onClick={() => rejectBooking(b.id)}>
                                                Reject
                                            </button>
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

export default AdminBookings
