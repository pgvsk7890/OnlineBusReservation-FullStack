import { useState, useEffect } from "react"
import api from "../services/api"

function Offers() {
  const [coupons, setCoupons] = useState([])
  const [copiedCode, setCopiedCode] = useState(null)

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupon/active")
      setCoupons(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2000)
  }

  const getGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
    ]
    return gradients[index % gradients.length]
  }

  const getIcon = (index) => {
    const icons = ["%"]
    return icons[index % icons.length]
  }

  return (
    <div className="offers-page">
      <div className="offers-hero">
        <div className="offers-hero-content">
          <h1>Exclusive Offers</h1>
          <p>Save big on your next bus journey with our amazing deals</p>
        </div>
        <div className="offers-hero-visual">
          <div className="offers-hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
        </div>
      </div>

      {copiedCode && (
        <div className="copy-toast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Coupon copied!
        </div>
      )}

      <div className="offers-stats">
        <div className="offers-stat">
          <span className="stat-number">{coupons.length}</span>
          <span className="stat-label">Active Offers</span>
        </div>
        <div className="offers-stat">
          <span className="stat-number">Up to {Math.max(...coupons.map(c => c.discountPercentage || 0), 0)}%</span>
          <span className="stat-label">Max Discount</span>
        </div>
        <div className="offers-stat">
          <span className="stat-number">Instant</span>
          <span className="stat-label">Booking Savings</span>
        </div>
      </div>

      <div className="offers-section">
        <h2>Available Coupons</h2>
        {coupons.length === 0 ? (
          <div className="no-offers">
            <div className="no-offers-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3>No Offers Available</h3>
            <p>Check back soon for exciting deals!</p>
          </div>
        ) : (
          <div className="coupons-grid">
            {coupons.map((coupon, index) => (
              <div 
                className="coupon-card" 
                key={coupon.id}
                style={{ background: getGradient(index) }}
              >
                <div className="coupon-card-left">
                  <div className="coupon-discount">
                    <span className="discount-value">{coupon.discountPercentage}</span>
                    <span className="discount-symbol">%</span>
                    <span className="discount-off">OFF</span>
                  </div>
                  <p className="coupon-tagline">{coupon.description || "Get amazing savings on your booking"}</p>
                </div>

                <div className="coupon-card-right">
                  <div className="coupon-code-box">
                    <span className="coupon-code">{coupon.couponCode}</span>
                    <button
                      className={`coupon-copy-btn ${copiedCode === coupon.couponCode ? "copied" : ""}`}
                      onClick={() => copyToClipboard(coupon.couponCode)}
                    >
                      {copiedCode === coupon.couponCode ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="coupon-details">
                    <div className="coupon-detail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                      <span>Min: Rs.{coupon.minAmount}</span>
                    </div>
                    {coupon.maxDiscount > 0 && (
                      <div className="coupon-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                        <span>Max: Rs.{coupon.maxDiscount}</span>
                      </div>
                    )}
                    <div className="coupon-detail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Valid: {coupon.validUntil}</span>
                    </div>
                  </div>

                  <div className="coupon-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                    Limited Time
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="offers-info-section">
        <h3>How to Use</h3>
        <div className="info-steps">
          <div className="info-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Select Your Trip</h4>
              <p>Search and choose your preferred bus and route</p>
            </div>
          </div>
          <div className="info-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Apply Coupon</h4>
              <p>Enter the coupon code during checkout</p>
            </div>
          </div>
          <div className="info-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Enjoy Savings</h4>
              <p>Get instant discount on your booking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offers
