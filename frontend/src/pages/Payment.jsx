import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../services/api"

function Payment() {
  const location = useLocation()
  const navigate = useNavigate()

  const seats = location.state?.seats || []
  const travelDate = location.state?.travelDate || ""

  const [paid, setPaid] = useState(false)
  const [utrNumber, setUtrNumber] = useState("")
  const [qrSecondsLeft, setQrSecondsLeft] = useState(420)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponMessage, setCouponMessage] = useState({ type: "", text: "" })

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const normalizeRepeatedText = (value) => {
    const text = (value || "").trim().replace(/\s+/g, " ")
    if (!text) return ""

    const words = text.split(" ")
    if (words.length % 2 !== 0) return text

    const half = words.length / 2
    const firstHalf = words.slice(0, half).join(" ")
    const secondHalf = words.slice(half).join(" ")

    return firstHalf.toLowerCase() === secondHalf.toLowerCase() ? firstHalf : text
  }

  const displayName = normalizeRepeatedText(user?.name)
  const paymentTimerKey = user?.id && travelDate && seats.length
    ? `payment-qr-expiry:${user.id}:${travelDate}:${seats.map((seat) => seat.id).sort((a, b) => a - b).join("-")}`
    : null

  const [passengerDetails, setPassengerDetails] = useState(() => {
    const initial = {}
    seats.forEach((seat, index) => {
      initial[seat.id] = {
        name: index === 0 ? displayName || "" : "",
        age: "",
        gender: "",
        phone: index === 0 ? user?.phone || "" : ""
      }
    })
    return initial
  })

  const amount = seats.reduce((sum, seat) => sum + seat.price, 0)
  const finalAmount = appliedCoupon ? amount - appliedCoupon.discount : amount

  const upiLink = encodeURIComponent(
    `upi://pay?pa=7013147368@mbk&pn=BusBooking&am=${finalAmount}&cu=INR&tn=SeatBooking`
  )

  const isQrExpired = qrSecondsLeft <= 0

  useEffect(() => {
    if (!paymentTimerKey || paid) {
      return
    }

    const storedExpiry = Number(localStorage.getItem(paymentTimerKey))
    const expiresAt = storedExpiry > Date.now() ? storedExpiry : Date.now() + 7 * 60 * 1000
    localStorage.setItem(paymentTimerKey, String(expiresAt))

    const syncTimer = () => {
      const secondsLeft = Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0)
      setQrSecondsLeft(secondsLeft)

      if (secondsLeft === 0) {
        localStorage.removeItem(paymentTimerKey)
      }
    }

    syncTimer()

    const timer = setInterval(() => {
      syncTimer()
    }, 1000)

    return () => clearInterval(timer)
  }, [paid, paymentTimerKey])

  useEffect(() => {
    if (!paymentTimerKey) {
      return
    }

    if (paid) {
      localStorage.removeItem(paymentTimerKey)
    }
  }, [paid, paymentTimerKey])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage({ type: "error", text: "Enter coupon code" })
      return
    }

    try {
      const res = await api.post("/coupon/apply", {
        couponCode,
        amount
      })

      setAppliedCoupon({
        code: couponCode,
        discount: res.data.discount
      })

      setCouponMessage({
        type: "success",
        text: `Coupon applied! You save Rs.${res.data.discount}`
      })
    } catch (err) {
      setCouponMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid coupon"
      })

      setAppliedCoupon(null)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponMessage({ type: "", text: "" })
  }

  const updatePassengerDetail = (seatId, field, value) => {
    setPassengerDetails((prev) => ({
      ...prev,
      [seatId]: {
        ...prev[seatId],
        [field]: value
      }
    }))
  }

  const handlePayment = async () => {
    if (!utrNumber.trim()) {
      alert("UTR number is mandatory")
      return
    }

    if (isQrExpired) {
      alert("QR validation time expired. Please try booking again.")
      return
    }

    try {
      const seatIds = seats.map((seat) => seat.id)
      const passengers = seats.map((seat) => {
        const detail = passengerDetails[seat.id] || {}
        return {
          seatId: seat.id,
          name: (detail.name || "").trim(),
          age: Number(detail.age),
          gender: (detail.gender || "").trim(),
          phone: (detail.phone || "").trim()
        }
      })

      for (const passenger of passengers) {
        if (!passenger.name) {
          alert("Passenger name is required for all seats")
          return
        }
        if (!passenger.age || passenger.age <= 0) {
          alert("Valid passenger age is required for all seats")
          return
        }
        if (!passenger.gender) {
          alert("Passenger gender is required for all seats")
          return
        }
      }

      await api.post("/booking/createBooking", {
        seatIds,
        userId: user?.id,
        utrNumber: utrNumber.trim().toUpperCase(),
        travelDate,
        passengers,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      })

      setPaid(true)
    } catch (err) {
      console.log(err)
      alert(err.response?.data || "Booking failed")
    }
  }

  const handleCancel = () => {
    if (paymentTimerKey) {
      localStorage.removeItem(paymentTimerKey)
    }
    navigate(-1)
  }

  if (seats.length === 0) {
    return (
      <div className="payment-page">
        <div className="payment-empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h3>No Seats Selected</h3>
          <p>Choose your seats first, then continue to payment.</p>
          <button className="primary-btn" onClick={() => navigate("/home")} type="button">
            Browse Buses
          </button>
        </div>
      </div>
    )
  }

  if (!travelDate) {
    return (
      <div className="payment-page">
        <div className="payment-empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3>Travel Date Required</h3>
          <p>Select a journey date before continuing.</p>
          <button className="primary-btn" onClick={() => navigate(-1)} type="button">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="payment-hero">
        <button onClick={() => navigate(-1)} className="back-btn" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
        <div className="payment-hero-content">
          <h1>Complete Your Booking</h1>
          <p>Review details and complete your payment</p>
        </div>
        <div className="payment-timer" style={{ background: isQrExpired ? "rgba(214, 69, 69, 0.15)" : "rgba(17, 150, 105, 0.15)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {isQrExpired ? "Expired" : formatTimer(qrSecondsLeft)}
        </div>
      </div>

      <div className="payment-content-grid">
        <div className="payment-main">
          <div className="payment-card">
            <div className="card-header">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2>Passenger Details</h2>
                <p>Enter details for all passengers</p>
              </div>
              <span className="seat-badge">{seats.length} Seat{seats.length > 1 ? "s" : ""}</span>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{displayName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Travel Date</span>
                <span className="detail-value">{travelDate}</span>
              </div>
            </div>
          </div>

          <div className="payment-card">
            <div className="card-header">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h2>Seat Information</h2>
                <p>Passenger details for each seat</p>
              </div>
            </div>

            <div className="seats-passengers">
              {seats.map((seat) => (
                <div className="seat-passenger-card" key={seat.id}>
                  <div className="seat-info">
                    <div className="seat-number">{seat.seatNumber}</div>
                    <div className="seat-price">Rs.{seat.price}</div>
                    <span className="seat-type-badge">{seat.seatType}</span>
                  </div>
                  <div className="passenger-form">
                    <div className="form-row">
                      <input
                        type="text"
                        value={passengerDetails[seat.id]?.name || ""}
                        onChange={(e) => updatePassengerDetail(seat.id, "name", e.target.value)}
                        placeholder={`Passenger name`}
                      />
                      <input
                        type="number"
                        value={passengerDetails[seat.id]?.age || ""}
                        onChange={(e) => updatePassengerDetail(seat.id, "age", e.target.value)}
                        placeholder="Age"
                        min="1"
                      />
                    </div>
                    <div className="form-row">
                      <select
                        value={passengerDetails[seat.id]?.gender || ""}
                        onChange={(e) => updatePassengerDetail(seat.id, "gender", e.target.value)}
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <input
                        type="text"
                        value={passengerDetails[seat.id]?.phone || ""}
                        onChange={(e) => updatePassengerDetail(seat.id, "phone", e.target.value)}
                        placeholder="Phone (optional)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="payment-card">
            <div className="card-header">
              <div className="card-icon coupon-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <div>
                <h2>Apply Coupon</h2>
                <p>Save more with coupon codes</p>
              </div>
            </div>

            {!appliedCoupon ? (
              <div className="coupon-form">
                <input
                  type="text"
                  value={couponCode}
                  placeholder="Enter coupon code"
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button onClick={applyCoupon} className="apply-btn" type="button">
                  Apply
                </button>
              </div>
            ) : (
              <div className="coupon-applied-card">
                <div className="coupon-info">
                  <span className="coupon-code">{appliedCoupon.code}</span>
                  <span className="coupon-discount">-Rs.{appliedCoupon.discount}</span>
                </div>
                <button className="remove-btn" onClick={removeCoupon} type="button">
                  Remove
                </button>
              </div>
            )}

            {couponMessage.text && (
              <p className={`coupon-message ${couponMessage.type}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          <div className="payment-sidebar">
            <div className="payment-card qr-card">
              <div className="card-header">
              <div className="card-icon qr-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div>
                <h2>Scan & Pay</h2>
                <p>Use any UPI app</p>
              </div>
            </div>

            <div className="qr-container">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${upiLink}`}
                alt="QR Code"
              />
              <p className="qr-amount">Pay Rs.{finalAmount}</p>
            </div>

            <div className="utr-input">
              <label>UTR Number *</label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="Enter 12-digit UTR"
                required
              />
            </div>

            <button className="pay-btn" onClick={handlePayment} disabled={isQrExpired || paid} type="button">
              {paid ? "Payment Submitted" : "Confirm Payment"}
            </button>

            <button className="cancel-link" onClick={handleCancel} type="button">
              Cancel Booking
            </button>
          </div>

          <div className="payment-summary">
            <h3>Summary</h3>
            <div className="summary-row">
              <span>Base Fare ({seats.length} seat{seats.length > 1 ? "s" : ""})</span>
              <span>Rs.{amount}</span>
            </div>
            {appliedCoupon && (
              <div className="summary-row discount">
                <span>Coupon Discount</span>
                <span>-Rs.{appliedCoupon.discount}</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>Rs.{finalAmount}</span>
            </div>
          </div>

          {paid && (
            <div className="success-card">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>Booking Submitted!</h3>
              <p>Your booking is pending admin approval. You'll receive a confirmation soon.</p>
              <button className="primary-btn" onClick={() => navigate("/home")} type="button">
                Back to Home
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
