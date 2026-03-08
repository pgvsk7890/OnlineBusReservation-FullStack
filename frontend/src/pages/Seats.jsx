import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"

function Seats() {

    const [seats, setSeats] = useState([])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [loading, setLoading] = useState(true)

    const { busId } = useParams()
    const navigate = useNavigate()

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

        try {
            const seatIds = selectedSeats.map(seat => seat.id)
            await api.post("/booking/lockSeats", seatIds)
            navigate("/payment", { state: { seats: selectedSeats } })
        } catch (err) {
            console.error(err)
            alert("Seat locking failed")
        }
    }

    const seaterSeats = seats.filter(s => s.seatType === "SEATER")
    const sleeperSeats = seats.filter(s => s.seatType === "SLEEPER")

    return (
        <div className="seats-page">
            <div className="seat-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    Back
                </button>
                <h2>Select Your Seats</h2>
            </div>

            <div className="seat-legend">
                <div className="legend-item">
                    <div className="seat-box available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="seat-box selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="seat-box booked"></div>
                    <span>Booked</span>
                </div>
                <div className="legend-item">
                    <div className="seat-box locked"></div>
                    <span>Locked</span>
                </div>
            </div>

            {loading ? (
                <p className="loading">Loading seats...</p>
            ) : (
                <div className="seat-layout">
                    <div className="seat-section">
                        <h3>Seater Seats</h3>
                        <div className="seat-grid seater-grid">
                            {seaterSeats.map(seat => (
                                <button
                                    key={seat.id}
                                    onClick={() => toggleSeat(seat)}
                                    disabled={seat.status !== "AVAILABLE"}
                                    className={`
seat 
${seat.status === "BOOKED" ? "booked" : ""}
${seat.status === "LOCKED" ? "locked" : ""}
${isSelected(seat) ? "selected" : ""}
`}
                                >
                                    <span>{seat.seatNumber}</span>
                                    <small>Rs.{seat.price}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="seat-section">
                        <h3>Sleeper Seats</h3>
                        <div className="seat-grid sleeper-grid">
                            {sleeperSeats.map(seat => (
                                <button
                                    key={seat.id}
                                    onClick={() => toggleSeat(seat)}
                                    disabled={seat.status !== "AVAILABLE"}
                                    className={`
seat sleeper
${seat.status === "BOOKED" ? "booked" : ""}
${seat.status === "LOCKED" ? "locked" : ""}
${isSelected(seat) ? "selected" : ""}
`}
                                >
                                    <span>{seat.seatNumber}</span>
                                    <small>Rs.{seat.price}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="seat-summary">
                        <h3>Booking Summary</h3>
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
