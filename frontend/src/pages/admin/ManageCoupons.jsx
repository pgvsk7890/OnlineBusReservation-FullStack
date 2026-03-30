import { useState, useEffect } from "react"
import api from "../../services/api"

function ManageCoupons() {
  const [coupons, setCoupons] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    couponCode: "",
    discountPercentage: "",
    validUntil: "",
    minAmount: "",
    maxDiscount: "",
    usageLimit: "",
    description: "",
    active: true
  })

  const today = new Date().toISOString().split("T")[0]

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupon/all")
      setCoupons(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCoupon) {
        await api.put(`/coupon/update/${editingCoupon.id}`, {
          ...formData,
          discountPercentage: parseInt(formData.discountPercentage),
          minAmount: parseInt(formData.minAmount),
          maxDiscount: parseInt(formData.maxDiscount),
          usageLimit: parseInt(formData.usageLimit)
        })
        alert("Coupon updated successfully")
      } else {
        await api.post("/coupon/create", {
          ...formData,
          discountPercentage: parseInt(formData.discountPercentage),
          minAmount: parseInt(formData.minAmount),
          maxDiscount: parseInt(formData.maxDiscount),
          usageLimit: parseInt(formData.usageLimit)
        })
        alert("Coupon created successfully")
      }
      setShowForm(false)
      setEditingCoupon(null)
      fetchCoupons()
      setFormData({
        couponCode: "",
        discountPercentage: "",
        validUntil: "",
        minAmount: "",
        maxDiscount: "",
        usageLimit: "",
        description: "",
        active: true
      })
    } catch {
      alert("Failed to save coupon")
    }
  }

  const editCoupon = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      couponCode: coupon.couponCode,
      discountPercentage: coupon.discountPercentage,
      validUntil: coupon.validUntil,
      minAmount: coupon.minAmount,
      maxDiscount: coupon.maxDiscount || "",
      usageLimit: coupon.usageLimit || "",
      description: coupon.description || "",
      active: coupon.active
    })
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingCoupon(null)
    setFormData({
      couponCode: "",
      discountPercentage: "",
      validUntil: "",
      minAmount: "",
      maxDiscount: "",
      usageLimit: "",
      description: "",
      active: true
    })
  }

  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return

    try {
      await api.delete(`/coupon/delete/${id}`)
      fetchCoupons()
    } catch {
      alert("Failed to delete coupon")
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <div className="admin-page-header-left">
            <h1>Manage Coupons</h1>
            <p>Create and manage discount coupons for your customers.</p>
          </div>
          <div className="admin-page-header-actions">
            <button className="admin-header-btn" onClick={() => setShowForm(!showForm)} type="button">
              {showForm ? "Cancel" : "+ Create Coupon"}
            </button>
          </div>
        </div>

        <div className="admin-page-content">
          {showForm && (
            <div className="admin-card coupon-form-card">
              <h3 className="admin-card-title">{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</h3>
              <form onSubmit={handleSubmit} className="coupon-form-grid">
                <div className="form-group">
                  <label>Coupon Code</label>
                  <input type="text" value={formData.couponCode} onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })} required placeholder="e.g., SAVE20" />
                </div>
                <div className="form-group">
                  <label>Discount Percentage (%)</label>
                  <input type="number" value={formData.discountPercentage} onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })} required placeholder="e.g., 20" />
                </div>
                <div className="form-group">
                  <label>Valid Until</label>
                  <input type="date" min={today} value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Minimum Amount (Rs)</label>
                  <input type="number" value={formData.minAmount} onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })} required placeholder="e.g., 500" />
                </div>
                <div className="form-group">
                  <label>Maximum Discount (Rs)</label>
                  <input type="number" value={formData.maxDiscount} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })} placeholder="e.g., 200" />
                </div>
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })} placeholder="e.g., 100" />
                </div>
                <div className="form-group coupon-form-full">
                  <label>Description</label>
                  <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g., Flat 20% off on all bookings" />
                </div>
                <div className="coupon-form-full">
                  <button type="submit" className="submit-btn">{editingCoupon ? "Update Coupon" : "Create Coupon"}</button>
                  <button type="button" className="action-btn reject" onClick={cancelForm}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="admin-card admin-table-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Coupon Inventory</h3>
            </div>

            <div className="admin-table-wrap admin-desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Discount</th>
                    <th>Min Amount</th>
                    <th>Max Discount</th>
                    <th>Usage</th>
                    <th>Valid Until</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>{coupon.couponCode}</td>
                      <td>{coupon.description || "-"}</td>
                      <td><span className="booking-card-amount">{coupon.discountPercentage}%</span></td>
                      <td>Rs.{coupon.minAmount}</td>
                      <td>Rs.{coupon.maxDiscount || "No limit"}</td>
                      <td>{coupon.usageCount || 0} / {coupon.usageLimit || "Unlimited"}</td>
                      <td>{coupon.validUntil}</td>
                      <td>
                        <span className={`status-badge ${coupon.active ? "confirmed" : "cancelled"}`}>
                          {coupon.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn view" onClick={() => editCoupon(coupon)} type="button">Edit</button>
                          <button className="action-btn reject" onClick={() => deleteCoupon(coupon.id)} type="button">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-mobile-bus-list">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="admin-item-card admin-mobile-data-card">
                  <div className="admin-item-card-header">
                    <div>
                      <div className="admin-item-card-title">{coupon.couponCode}</div>
                      <span className="admin-item-card-id">{coupon.description || "No description"}</span>
                    </div>
                    <span className={`status-badge ${coupon.active ? "confirmed" : "cancelled"}`}>
                      {coupon.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="admin-item-card-body">
                    <div className="admin-item-row">
                      <span className="admin-item-label">Discount</span>
                      <span className="booking-card-amount">{coupon.discountPercentage}%</span>
                    </div>
                    <div className="admin-item-row">
                      <span className="admin-item-label">Min Amount</span>
                      <span className="admin-item-value">Rs.{coupon.minAmount}</span>
                    </div>
                    <div className="admin-item-row">
                      <span className="admin-item-label">Max Discount</span>
                      <span className="admin-item-value">Rs.{coupon.maxDiscount || "No limit"}</span>
                    </div>
                    <div className="admin-item-row">
                      <span className="admin-item-label">Usage</span>
                      <span className="admin-item-value">{coupon.usageCount || 0} / {coupon.usageLimit || "Unlimited"}</span>
                    </div>
                    <div className="admin-item-row">
                      <span className="admin-item-label">Valid Until</span>
                      <span className="admin-item-value">{coupon.validUntil}</span>
                    </div>
                  </div>

                  <div className="admin-item-card-actions">
                    <button className="action-btn view" onClick={() => editCoupon(coupon)} type="button">Edit</button>
                    <button className="action-btn reject" onClick={() => deleteCoupon(coupon.id)} type="button">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageCoupons
