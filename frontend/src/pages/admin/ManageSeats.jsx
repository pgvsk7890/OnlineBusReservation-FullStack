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
        setSelectedSeat(null)
        fetchSeats()
    }, [busId])

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
        const priceNum = Number(price)
        if (isNaN(priceNum) || priceNum <= 0) {
            alert("Price must be greater than 0")
            return
        }
        try {
            await api.put(`/bus/seatPrice/${selectedSeat.id}`, { price: priceNum })
            alert("Seat price updated")
            setSelectedSeat(null)
            fetchSeats()
        } catch {
            alert("Update failed")
        }
    }

    if (loading) {
        return <div className="admin-page"><div className="loading-state"><div className="loading-spinner"></div></div></div>
    }

    const sortSeats = (seatList) => [...seatList].sort((a, b) =>
        a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true, sensitivity: "base" })
    )

    const seaterSeats = sortSeats(seats.filter((s) => s.seatType === "SEATER"))
    const sleeperSeats = sortSeats(seats.filter((s) => s.seatType === "SLEEPER"))
    const availableSeats = seats.filter((s) => s.status === "AVAILABLE")
    const unavailableSeats = seats.filter((s) => s.status !== "AVAILABLE")
    const averagePrice = seats.length
        ? Math.round(seats.reduce((sum, seat) => sum + Number(seat.price || 0), 0) / seats.length)
        : 0

    const lowerDeckLeftSleepers = sleeperSeats.slice(0, 5)
    const upperDeckLeftSleepers = sleeperSeats.slice(5, 10)
    const upperDeckSleepers = sleeperSeats.slice(10, 20)
    const upperDeckMiddleSleepers = upperDeckSleepers.slice(0, 5)
    const upperDeckRightSleepers = upperDeckSleepers.slice(5, 10)
    const lowerDeckRightSeaters = seaterSeats
    const lowerDeckInnerSeaters = lowerDeckRightSeaters.filter((_, index) => index % 2 === 0)
    const lowerDeckOuterSeaters = lowerDeckRightSeaters.filter((_, index) => index % 2 === 1)

    const renderAdminSeatTile = (seat, sleeper = false) => (
        <div
            key={seat.id}
            onClick={() => selectSeat(seat)}
            className={`seat-tile admin-seat-tile ${sleeper ? "sleeper" : "seater"} ${selectedSeat?.id === seat.id
                ? "selected"
                : seat.status === "AVAILABLE"
                    ? "available"
                    : "unavailable"
                }`}
        >
            <div className="seat-tile-number">{seat.seatNumber}</div>
            <div className="seat-tile-price">Rs {seat.price}</div>
        </div>
    )

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
                        <div className="admin-card admin-seats-panel">
                            <div className="admin-card-header">
                                <div>
                                    <h3 className="admin-card-title">Seats Layout</h3>
                                    <p className="admin-seat-panel-copy">Choose a seat to update its price and review the full bus layout.</p>
                                </div>
                            </div>

                            <div className="admin-seat-summary-grid">
                                <div className="admin-seat-summary-tile">
                                    <span>Total Seats</span>
                                    <strong>{seats.length}</strong>
                                </div>
                                <div className="admin-seat-summary-tile">
                                    <span>Available</span>
                                    <strong>{availableSeats.length}</strong>
                                </div>
                                <div className="admin-seat-summary-tile">
                                    <span>Locked</span>
                                    <strong>{unavailableSeats.length}</strong>
                                </div>
                                <div className="admin-seat-summary-tile">
                                    <span>Avg Price</span>
                                    <strong>Rs {averagePrice}</strong>
                                </div>
                            </div>

                            <div className="admin-seat-legend">
                                <span><i className="seat-legend-dot available"></i>Available</span>
                                <span><i className="seat-legend-dot selected"></i>Selected</span>
                                <span><i className="seat-legend-dot locked"></i>Locked</span>
                            </div>

                            <div className="admin-seat-decks">
                                <div className="seat-section deck-card admin-seat-card">
                                    <div className="deck-header">
                                        <div>
                                            <h3>Lower</h3>
                                            <p>5 sleepers and seater columns</p>
                                        </div>
                                    </div>
                                    <div className="deck-layout lower-deck-layout">
                                        <div className="deck-lane sleeper-lane edge-lane">
                                            <div className="seat-grid lower-left-sleeper-grid">
                                                {lowerDeckLeftSleepers.map((seat) => renderAdminSeatTile(seat, true))}
                                            </div>
                                        </div>
                                        <div className="deck-lane seater-lane">
                                            <div className="lower-seater-grid">
                                                <div className="seat-grid lower-seater-column">
                                                    {lowerDeckInnerSeaters.map((seat) => renderAdminSeatTile(seat))}
                                                </div>
                                                <div className="seat-grid lower-seater-column">
                                                    {lowerDeckOuterSeaters.map((seat) => renderAdminSeatTile(seat))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="seat-section deck-card admin-seat-card">
                                    <div className="deck-header">
                                        <div>
                                            <h3>Upper</h3>
                                            <p>5 sleepers and 10 sleepers</p>
                                        </div>
                                    </div>
                                    <div className="deck-layout upper-deck-layout">
                                        <div className="deck-lane sleeper-lane edge-lane">
                                            <div className="seat-grid upper-left-sleeper-grid">
                                                {upperDeckLeftSleepers.map((seat) => renderAdminSeatTile(seat, true))}
                                            </div>
                                        </div>
                                        <div className="deck-lane sleeper-lane wide">
                                            <div className="upper-right-sleeper-grid">
                                                <div className="seat-grid upper-sleeper-column">
                                                    {upperDeckMiddleSleepers.map((seat) => renderAdminSeatTile(seat, true))}
                                                </div>
                                                <div className="seat-grid upper-sleeper-column">
                                                    {upperDeckRightSleepers.map((seat) => renderAdminSeatTile(seat, true))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                    <div className="seat-edit-meta">
                                        <span className="status-badge confirmed">{selectedSeat.seatType}</span>
                                        <span className={`status-badge ${selectedSeat.status === "AVAILABLE" ? "confirmed" : "cancelled"}`}>
                                            {selectedSeat.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Seat Price (Rs)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="admin-seat-edit-note">
                                    Update the fare for this seat and save the changes instantly.
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
