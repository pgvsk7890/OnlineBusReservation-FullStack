import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function UserProfile() {
  const [user, setUser] = useState(null)
  const [file, setFile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [passwordMode, setPasswordMode] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = localStorage.getItem("user")

      if (!storedUser) {
        navigate("/login")
        return
      }

      let sessionUser
      try {
        sessionUser = JSON.parse(storedUser)
      } catch {
        localStorage.removeItem("user")
        navigate("/login")
        return
      }

      if (sessionUser.role === "ADMIN") {
        navigate("/admin/profile")
        return
      }

      if (sessionUser.role !== "USER") {
        localStorage.removeItem("user")
        navigate("/login")
        return
      }

      try {
        const res = await api.get(`/user/${sessionUser.id}`)
        const freshUser = res.data

        setUser(freshUser)
        setFormData({
          name: freshUser.name || "",
          email: freshUser.email || "",
          phone: freshUser.phone || ""
        })

        const token = sessionUser.token
        localStorage.setItem("user", JSON.stringify({
          ...freshUser,
          token
        }))
      } catch {
        localStorage.removeItem("user")
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [navigate])

  const uploadImage = async () => {
    if (!file) {
      alert("Select image")
      return
    }

    try {
      const data = new FormData()
      data.append("file", file)

      const res = await api.post(`/user/upload/${user.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      const token = user?.token || JSON.parse(localStorage.getItem("user") || "{}")?.token
      localStorage.setItem("user", JSON.stringify({ ...res.data, token }))
      setUser({ ...res.data, token })

      setFile(null)
      alert("Profile image updated")
    } catch (err) {
      console.log(err)
      alert("Upload failed")
    }
  }

  const handleSave = async () => {
    try {
      const res = await api.put(`/user/update/${user.id}`, formData)

      const token = user?.token || JSON.parse(localStorage.getItem("user") || "{}")?.token
      localStorage.setItem("user", JSON.stringify({ ...res.data, token }))

      setUser({ ...res.data, token })
      setEditMode(false)
      alert("Profile updated")
    } catch (err) {
      console.log(err)
      alert("Update failed")
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError("")
    setPasswordSuccess("")

    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required")
      return
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    try {
      await api.post(`/user/change-password/${user.id}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      setPasswordSuccess("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => {
        setPasswordMode(false)
        setPasswordSuccess("")
      }, 2000)
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password")
    }
  }

  const stats = {
    bookings: user?.totalBookings || user?.bookingCount || 0,
    confirmed: user?.confirmedBookings || user?.bookedCount || 0,
    memberSince: user?.createdAt || user?.created_at || user?.joinDate
      ? new Date(user.createdAt || user.created_at || user.joinDate).toLocaleDateString("en-IN", { year: "numeric", month: "short" })
      : "N/A"
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-hero">
          <div className="hero-content">
            <h1>My Profile</h1>
            <p>Manage your account settings</p>
          </div>
        </div>
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-hero">
          <div className="hero-content">
            <h1>My Profile</h1>
            <p>Manage your account settings</p>
          </div>
        </div>
        <div className="loading-state">
          <span className="loading-spinner"></span>
          <p>Unable to load profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="hero-content">
          <h1>My Profile</h1>
          <p>Manage your account settings and personal information</p>
        </div>
        <div className="profile-hero-stats">
          <div className="profile-stat">
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-count">{stats.bookings}</span>
              <span className="stat-text">Bookings</span>
            </div>
          </div>
          <div className="profile-stat">
            <div className="stat-icon confirmed">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-count">{stats.confirmed}</span>
              <span className="stat-text">Booked</span>
            </div>
          </div>
          <div className="profile-stat">
            <div className="stat-icon member">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-count">{stats.memberSince}</span>
              <span className="stat-text">Member Since</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-section">
              {user.profileImage ? (
                <img
                  src={user.profileImage.startsWith("http") ? user.profileImage : `http://localhost:8080/uploads/${user.profileImage}`}
                  alt="profile"
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {editMode && (
                <div className="upload-section">
                  <label className="upload-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      accept="image/*"
                    />
                  </label>
                  {file && (
                    <button className="upload-confirm-btn" onClick={uploadImage}>
                      Upload Photo
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <label>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Full Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              ) : (
                <span>{user.name}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email Address
              </label>
              {editMode ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone"
                />
              ) : (
                <span>{user.phone || "Not set"}</span>
              )}
            </div>
          </div>

          <div className="profile-card-footer">
            {editMode ? (
              <>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-sidebar">
          {passwordMode ? (
            <div className="profile-card change-password-card">
              <div className="card-header">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3>Change Password</h3>
              </div>

              {passwordError && (
                <div className="password-error">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="password-success">{passwordSuccess}</div>
              )}

              <div className="password-fields">
                <div className="password-field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="password-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="password-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="password-actions">
                <button className="cancel-btn" onClick={() => {
                  setPasswordMode(false)
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  setPasswordError("")
                }}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handlePasswordChange}>
                  Update Password
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-quick-actions">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <a href="/mybookings" className="quick-action-card">
                  <div className="quick-action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span>My Bookings</span>
                </a>
                <a href="/offers" className="quick-action-card">
                  <div className="quick-action-icon offer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                  <span>Offers</span>
                </a>
                <a href="/support" className="quick-action-card">
                  <div className="quick-action-icon support">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <span>Support</span>
                </a>
                <a href="/home" className="quick-action-card">
                  <div className="quick-action-icon home">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <span>Book Now</span>
                </a>
                <button className="quick-action-card" onClick={() => setPasswordMode(true)}>
                  <div className="quick-action-icon password">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
