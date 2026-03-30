import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Home() {
  const [buses, setBuses] = useState([])
  const [offers, setOffers] = useState([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [copiedCode, setCopiedCode] = useState(null)
  const [activeOfferIndex, setActiveOfferIndex] = useState(0)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    fetchAllBuses()
    fetchOffers()
  }, [])

  useEffect(() => {
    if (offers.length <= 1) {
      return
    }

    const intervalId = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % offers.length)
    }, 3500)

    return () => clearInterval(intervalId)
  }, [offers])

  const fetchAllBuses = async () => {
    setLoading(true)

    try {
      const res = await api.get("/bus/all")
      setBuses(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOffers = async () => {
    try {
      const res = await api.get("/coupon/active")
      setOffers(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const searchBus = async () => {
    if (!from.trim() || !to.trim()) {
      alert("Enter from and to city")
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const res = await api.get(`/bus/search?from=${from}&to=${to}&date=${date}`)
      setBuses(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const safetyInstructions = [
    { 
      id: 1, 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      ), 
      title: "Verify Ticket", 
      description: "Always verify your ticket and bus number before boarding." 
    },
    { 
      id: 2, 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ), 
      title: "Secure Bags", 
      description: "Keep your valuables safe and make sure your luggage is tagged." 
    },
    { 
      id: 3, 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ), 
      title: "Arrive Early", 
      description: "Reach the boarding point at least 15 minutes before departure." 
    },
    { 
      id: 4, 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
        </svg>
      ), 
      title: "Stay Connected", 
      description: "Keep your phone charged and save the support contact details." 
    }
  ]

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getGradient = (index) => {
    const gradients = [
      { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", accent: "#f093fb" },
      { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", accent: "#fee140" },
      { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", accent: "#43e97b" },
      { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", accent: "#667eea" }
    ]
    return gradients[index % gradients.length]
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Book Bus Tickets</h1>
            <p>Find and book bus tickets at the best prices</p>
          </div>
        </div>
        
        <div className="search-box">
          <div className="search-fields">
            <div className="search-field-group">
              <div className="search-field">
                <label>From</label>
                <div className="field-input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 8 12 12 14 14" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Leaving from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
              </div>

              <div className="search-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="search-field">
                <label>To</label>
                <div className="field-input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Going to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="search-field">
                <label>Date</label>
                <div className="field-input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                  />
                </div>
              </div>
            </div>

            <button className="search-btn" onClick={searchBus} disabled={loading}>
              {loading ? (
                <span className="btn-spinner"></span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {!hasSearched && (
        <>
          <section className="offers-section">
            <div className="section-header">
              <h2>Exclusive Offers</h2>
              <p>Grab amazing deals on your next trip</p>
            </div>

            {offers.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <h3>No offers available</h3>
                <p>Check back soon for exciting deals!</p>
              </div>
            ) : (
              <div className="offers-showcase">
                {offers.slice(0, 4).map((offer, index) => {
                  const style = getGradient(index)
                  return (
                    <div className="offer-showcase-card" key={offer.id} style={{ background: style.bg }}>
                      <div className="offer-badge">Save {offer.discountPercentage}%</div>
                      <div className="offer-details">
                        <h3>{offer.couponCode}</h3>
                        <p>{offer.description || "Get instant discount on booking"}</p>
                        <div className="offer-meta">
                          <span>Min: Rs.{offer.minAmount}</span>
                          {offer.maxDiscount > 0 && <span>Max: Rs.{offer.maxDiscount}</span>}
                        </div>
                      </div>
                      <button 
                        className={`offer-copy-btn ${copiedCode === offer.couponCode ? "copied" : ""}`}
                        onClick={() => copyToClipboard(offer.couponCode)}
                      >
                        {copiedCode === offer.couponCode ? "Copied!" : "Copy Code"}
                      </button>
                    </div>
                  )
                })}
              </div>
              )}

              <div className="view-all-link">
                <Link to="/offers">View All Offers</Link>
              </div>
            </section>

          <section className="safety-section">
            <div className="section-header">
              <h2>Travel Smart</h2>
              <p>Essential tips for a smooth journey</p>
            </div>

            <div className="safety-grid">
              {safetyInstructions.map((item) => (
                <div className="safety-card" key={item.id}>
                  <div className="safety-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="buses-section">
        <div className="section-header">
          <h2>{hasSearched ? "Search Results" : "Popular Routes"}</h2>
          <p>{hasSearched ? `${buses.length} bus${buses.length !== 1 ? "es" : ""} found` : "Book your preferred bus today"}</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <span className="loading-spinner"></span>
            <p>Finding the best buses for you...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <h3>No buses found</h3>
            <p>Try different cities or check back later</p>
          </div>
        ) : (
          <div className="buses-grid">
            {buses.map((bus) => (
              <div className="bus-card" key={bus.id}>
                <div className="bus-card-header">
                  <div className="bus-info">
                    <h3>{bus.busName}</h3>
                    <span className="bus-number">{bus.busNumber}</span>
                    <span className="bus-type">{bus.busType}</span>
                  </div>
                  <div className="bus-rating">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>4.5</span>
                  </div>
                </div>

                <div className="bus-route">
                  <div className="route-point">
                    <div className="route-dot start"></div>
                    <div className="route-info">
                      <span className="route-time">{bus.departureTime}</span>
                      <span className="route-city">{bus.fromCity}</span>
                    </div>
                  </div>
                  <div className="route-line">
                    <span>6h 30m</span>
                  </div>
                  <div className="route-point">
                    <div className="route-dot end"></div>
                    <div className="route-info">
                      <span className="route-time">{bus.arrivalTime}</span>
                      <span className="route-city">{bus.toCity}</span>
                    </div>
                  </div>
                </div>

                <div className="bus-card-footer">
                  <div className="bus-prices">
                    <div className="price-item">
                      <span className="price-type">Seater</span>
                      <span className="price-value">Rs.{bus.seaterPrice}</span>
                    </div>
                    <div className="price-item">
                      <span className="price-type">Sleeper</span>
                      <span className="price-value">Rs.{bus.sleeperPrice}</span>
                    </div>
                  </div>
                  <Link to={`/seats/${bus.id}`} state={{ travelDate: date }} className="book-btn">
                    View Seats
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
