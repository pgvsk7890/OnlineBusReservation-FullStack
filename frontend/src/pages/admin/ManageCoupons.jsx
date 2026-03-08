import { useState, useEffect } from "react"
import api from "../../services/api"


function ManageCoupons() {

    const [coupons, setCoupons] = useState([])
    const [showForm, setShowForm] = useState(false)
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

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            const res = await api.get("/coupon/all")
            setCoupons(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post("/coupon/create", {
                ...formData,
                discountPercentage: parseInt(formData.discountPercentage),
                minAmount: parseInt(formData.minAmount),
                maxDiscount: parseInt(formData.maxDiscount),
                usageLimit: parseInt(formData.usageLimit)
            })
            alert("Coupon created successfully")
            setShowForm(false)
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
        } catch (err) {
            alert("Failed to create coupon")
        }
    }

    const deleteCoupon = async (id) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await api.delete(`/coupon/delete/${id}`)
                fetchCoupons()
            } catch (err) {
                alert("Failed to delete coupon")
            }
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
                        <button className="admin-header-btn" onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Cancel" : "+ Create Coupon"}
                        </button>
                    </div>
                </div>
                
                <div className="admin-page-content">

                    {showForm && (
                        <div className="admin-card coupon-form-card">
                    <h3 className="admin-card-title">Create New Coupon</h3>
                    <form onSubmit={handleSubmit} className="coupon-form-grid">
                        <div className="form-group">
                            <label>Coupon Code</label>
                            <input
                                type="text"
                                value={formData.couponCode}
                                onChange={(e) => setFormData({...formData, couponCode: e.target.value.toUpperCase()})}
                                required
                                placeholder="e.g., SAVE20"
                            />
                        </div>
                        <div className="form-group">
                            <label>Discount Percentage (%)</label>
                            <input
                                type="number"
                                value={formData.discountPercentage}
                                onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                                required
                                placeholder="e.g., 20"
                            />
                        </div>
                        <div className="form-group">
                            <label>Valid Until</label>
                            <input
                                type="date"
                                value={formData.validUntil}
                                onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Minimum Amount (₹)</label>
                            <input
                                type="number"
                                value={formData.minAmount}
                                onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                                required
                                placeholder="e.g., 500"
                            />
                        </div>
                        <div className="form-group">
                            <label>Maximum Discount (₹)</label>
                            <input
                                type="number"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                                placeholder="e.g., 200"
                            />
                        </div>
                        <div className="form-group">
                            <label>Usage Limit</label>
                            <input
                                type="number"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                placeholder="e.g., 100 (0 for unlimited)"
                            />
                        </div>
                        <div className="form-group coupon-form-full">
                            <label>Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="e.g., Flat 20% off on all bookings"
                            />
                        </div>
                        <div className="coupon-form-full">
                            <button type="submit" className="submit-btn">Create Coupon</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card">
                <div className="admin-table-wrap">
                <table className="admin-table mobile-card-table">
                    <thead>
                        <tr>
                            <th>Code</th>
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
                        {coupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td data-label="Code"><strong>{coupon.couponCode}</strong></td>
                                <td data-label="Discount">{coupon.discountPercentage}%</td>
                                <td data-label="Min Amount">₹{coupon.minAmount}</td>
                                <td data-label="Max Discount">₹{coupon.maxDiscount || "No limit"}</td>
                                <td data-label="Usage">{coupon.usageCount || 0}/{coupon.usageLimit || "∞"}</td>
                                <td data-label="Valid Until">{coupon.validUntil}</td>
                                <td data-label="Status">
                                    <span className={`status-badge ${coupon.active ? "confirmed" : "cancelled"}`}>
                                        {coupon.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td data-label="Actions">
                                    <button 
                                        className="delete-btn"
                                        onClick={() => deleteCoupon(coupon.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default ManageCoupons
