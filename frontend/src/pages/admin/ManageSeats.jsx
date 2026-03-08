import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../services/api"

function ManageSeats() {
    const { busId } = useParams()
    const [seats, setSeats] = useState([])
    const [selectedSeat, setSelectedSeat] = useState(null)
    const [price, setPrice] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSeats()
    }, [])

    const fetchSeats = async () => {
        try {
            const res = await api.get(`/bus/seats/${busId}`)
            setSeats(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const selectSeat = (seat) => {
        setSelectedSeat(seat)
        setPrice(seat.price)
    }

    const updatePrice = async () => {
        try {
            await api.put(`/bus/seatPrice/${selectedSeat.id}`, { price: Number(price) })
            alert("Seat price updated")
            setSelectedSeat(null)
            fetchSeats()
        } catch (err) {
            alert("Update failed")
        }
    }

    if (loading) {
        return <div className="admin-page"><div className="loading-state"><div className="loading-spinner"></div></div></div>
    }

    const seaterSeats = seats.filter((s) => s.seatType === "SEATER")
    const sleeperSeats = seats.filter((s) => s.seatType === "SLEEPER")

    return (
        <div className="admin-page">
            <div className="admin-page-container">
                <div className="admin-page-header">
                    <div className="admin-page-header-left">
                        <h1>Manage Seats</h1>
                        <p>View and update seat prices for this bus.</p>
                    </div>
                </div>

                <div className="admin-page-content">
                    <div className={`seat-manage-layout ${selectedSeat ? "has-selection" : ""}`}>
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3 className="admin-card-title">Seats Layout</h3>
                            </div>

                            <div className="seat-type-block">
                                <h4 className="seat-type-title">Seater</h4>
                                <div className="seat-tile-grid seater-grid-admin">
                                    {seaterSeats.map((seat) => (
                                        <div
                                            key={seat.id}
                                            onClick={() => selectSeat(seat)}
                                            className={`seat-tile ${selectedSeat?.id === seat.id
                                                ? "selected"
                                                : seat.status === "AVAILABLE"
                                                    ? "available"
                                                    : "unavailable"
                                                }`}
                                        >
                                            <div className="seat-tile-number">{seat.seatNumber}</div>
                                            <div className="seat-tile-price">Rs {seat.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="seat-type-title">Sleeper</h4>
                                <div className="seat-tile-grid sleeper-grid-admin">
                                    {sleeperSeats.map((seat) => (
                                        <div
                                            key={seat.id}
                                            onClick={() => selectSeat(seat)}
                                            className={`seat-tile sleeper ${selectedSeat?.id === seat.id
                                                ? "selected"
                                                : seat.status === "AVAILABLE"
                                                    ? "available"
                                                    : "unavailable"
                                                }`}
                                        >
                                            <div className="seat-tile-number">{seat.seatNumber}</div>
                                            <div className="seat-tile-price">Rs {seat.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedSeat && (
                            <div className="admin-card seat-edit-card">
                                <div className="admin-card-header">
                                    <h3 className="admin-card-title">Edit Seat</h3>
                                    <button className="action-btn reject" onClick={() => setSelectedSeat(null)}>Cancel</button>
                                </div>
                                <div className="seat-edit-preview-wrap">
                                    <div className="seat-edit-preview">{selectedSeat.seatNumber}</div>
                                    <span className="status-badge confirmed">{selectedSeat.seatType}</span>
                                </div>
                                <div className="form-group">
                                    <label>Seat Price (Rs)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <button className="submit-btn" onClick={updatePrice}>
                                    Update Price
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageSeats
