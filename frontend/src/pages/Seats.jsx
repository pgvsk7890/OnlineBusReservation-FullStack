import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import api from "../services/api"

function Seats() {

    const [seats, setSeats] = useState([])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [loading, setLoading] = useState(true)
    const [fareFilter, setFareFilter] = useState("ALL")
    const [travelDate, setTravelDate] = useState("")

    const { busId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const today = new Date().toISOString().split("T")[0]

    useEffect(() => {
        setTravelDate(location.state?.travelDate || "")
    }, [location.state])

    useEffect(() => {
        fetchSeats()
    }, [])

    const fetchSeats = async () => {
        try {
            const res = await api.get(`/bus/seats/${busId}`)
            setSeats(res.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleSeat = (seat) => {
        if (seat.status !== "AVAILABLE") return

        setSelectedSeats(prev => {
            const exists = prev.find(s => s.id === seat.id)
            if (exists) {
                return prev.filter(s => s.id !== seat.id)
            }
            return [...prev, seat]
        })
    }

    const isSelected = (seat) => {
        return selectedSeats.find(s => s.id === seat.id)
    }

    const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0)

    const proceedToPayment = async () => {
        if (selectedSeats.length === 0) {
            alert("Select seats first")
            return
        }

        if (!travelDate) {
            alert("Select a travel date")
            return
        }

        try {
            const seatIds = selectedSeats.map(seat => seat.id)
            await api.post("/booking/lockSeats", seatIds)
            navigate("/payment", { state: { seats: selectedSeats, travelDate } })
        } catch (err) {
            console.error(err)
            alert("Seat locking failed")
        }
    }

    const sortSeats = (seatList) => [...seatList].sort((a, b) =>
        a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true, sensitivity: "base" })
    )

    const seaterSeats = sortSeats(seats.filter(s => s.seatType === "SEATER"))
    const sleeperSeats = sortSeats(seats.filter(s => s.seatType === "SLEEPER"))
    const fareOptions = [...new Set(seats.map((seat) => seat.price))].sort((a, b) => a - b)

    const applyFareFilter = (seatList) => {
        if (fareFilter === "ALL") return seatList
        return seatList.filter((seat) => seat.price === fareFilter)
    }

    const lowerDeckLeftSleepers = applyFareFilter(sleeperSeats.slice(0, 5))
    const upperDeckLeftSleepers = applyFareFilter(sleeperSeats.slice(5, 10))
    const upperDeckSleepers = applyFareFilter(sleeperSeats.slice(10, 20))
    const upperDeckMiddleSleepers = upperDeckSleepers.slice(0, 5)
    const upperDeckRightSleepers = upperDeckSleepers.slice(5, 10)

    const filteredSeaterSeats = applyFareFilter(seaterSeats)
    const lowerDeckInnerSeaters = filteredSeaterSeats.filter((_, index) => index % 2 === 0)
    const lowerDeckOuterSeaters = filteredSeaterSeats.filter((_, index) => index % 2 === 1)

    const renderSeatButton = (seat, sleeper = false) => (
        <button
            key={seat.id}
            onClick={() => toggleSeat(seat)}
            disabled={seat.status !== "AVAILABLE"}
            className={`seat${sleeper ? " sleeper" : " seater" } ${seat.status === "BOOKED" ? "booked" : ""} ${seat.status === "LOCKED" ? "locked" : ""} ${isSelected(seat) ? "selected" : ""}`.trim()}
        >
            <span>{seat.seatNumber}</span>
            <small>Rs.{seat.price}</small>
        </button>
    )

    return (
        <div className="seats-page">
            <div className="seat-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    Back
                </button>
                <h2>Select Your Seats</h2>
            </div>

            <div className="admin-seat-legend">
                <span><i className="seat-legend-dot available"></i>Available</span>
                <span><i className="seat-legend-dot selected"></i>Selected</span>
                <span><i className="seat-legend-dot booked"></i>Booked</span>
                <span><i className="seat-legend-dot locked"></i>Locked</span>
            </div>

            <div className="seat-filters">
                <button
                    className={`seat-filter-chip ${fareFilter === "ALL" ? "active" : ""}`}
                    onClick={() => setFareFilter("ALL")}
                >
                    All
                </button>
                {fareOptions.map((price) => (
                    <button
                        key={price}
                        className={`seat-filter-chip ${fareFilter === price ? "active" : ""}`}
                        onClick={() => setFareFilter(price)}
                    >
                        Rs.{price}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="loading">Loading seats...</p>
            ) : (
                <div className="seat-layout">
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
                                        {lowerDeckLeftSleepers.map((seat) => renderSeatButton(seat, true))}
                                    </div>
                                </div>
                                <div className="deck-lane seater-lane">
                                    <div className="lower-seater-grid">
                                        <div className="seat-grid lower-seater-column">
                                            {lowerDeckInnerSeaters.map((seat) => renderSeatButton(seat))}
                                        </div>
                                        <div className="seat-grid lower-seater-column">
                                            {lowerDeckOuterSeaters.map((seat) => renderSeatButton(seat))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="deck-footer">
                                <span className="deck-label">Lower Deck</span>
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
                                        {upperDeckLeftSleepers.map((seat) => renderSeatButton(seat, true))}
                                    </div>
                                </div>
                                <div className="deck-lane sleeper-lane wide">
                                    <div className="upper-right-sleeper-grid">
                                        <div className="seat-grid upper-sleeper-column">
                                            {upperDeckMiddleSleepers.map((seat) => renderSeatButton(seat, true))}
                                        </div>
                                        <div className="seat-grid upper-sleeper-column">
                                            {upperDeckRightSleepers.map((seat) => renderSeatButton(seat, true))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="deck-footer">
                                <span className="deck-label">Upper Deck</span>
                            </div>
                        </div>
                    </div>

                    <div className="seat-summary">
                        <h3>Booking Summary</h3>
                        <div className="input-group">
                            <label>Travel Date</label>
                            <input
                                type="date"
                                value={travelDate}
                                onChange={(e) => setTravelDate(e.target.value)}
                                min={today}
                            />
                        </div>
                        <p>Seats Selected: {selectedSeats.length}</p>

                        <div className="selected-seat-list">
                            {selectedSeats.map(s => (
                                <span key={s.id}>{s.seatNumber}</span>
                            ))}
                        </div>

                        <h2>Total: Rs.{totalPrice}</h2>

                        <button
                            onClick={proceedToPayment}
                            disabled={selectedSeats.length === 0}
                            className="pay-btn"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Seats
