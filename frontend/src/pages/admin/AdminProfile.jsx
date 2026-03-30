import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"

function AdminProfile() {
    const [admin, setAdmin] = useState(null)
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    })

    useEffect(() => {
        const loadAdminProfile = async () => {
            const userStr = localStorage.getItem("user")
            if (!userStr) {
                navigate("/login")
                return
            }

            let sessionUser
            try {
                sessionUser = JSON.parse(userStr)
            } catch {
                localStorage.removeItem("user")
                navigate("/login")
                return
            }

            if (sessionUser.role === "USER") {
                navigate("/profile")
                return
            }

            if (sessionUser.role !== "ADMIN") {
                localStorage.removeItem("user")
                navigate("/login")
                return
            }

            try {
                const res = await api.get(`/user/${sessionUser.id}`)
                const freshAdmin = res.data

                setAdmin(freshAdmin)
                setFormData({
                    name: freshAdmin.name || "",
                    email: freshAdmin.email || "",
                    phone: freshAdmin.phone || ""
                })

                const token = sessionUser.token
                localStorage.setItem("user", JSON.stringify({
                    ...freshAdmin,
                    token
                }))
            } catch {
                localStorage.removeItem("user")
                navigate("/login")
            }
        }

        loadAdminProfile()
    }, [navigate])

    const uploadImage = async () => {
        if (!file) {
            alert("Please select an image")
            return
        }

        try {
            const sessionUser = JSON.parse(localStorage.getItem("user") || "{}")
            const token = sessionUser?.token || admin?.token
            const userId = sessionUser?.id || admin?.id

            if (!userId) {
                alert("User session not found. Please login again.")
                navigate("/login")
                return
            }

            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file.")
                return
            }

            const maxSizeMb = 2
            if (file.size > maxSizeMb * 1024 * 1024) {
                alert(`Image must be under ${maxSizeMb}MB.`)
                return
            }

            const payload = new FormData()
            payload.append("file", file)

            const res = await api.post(`/user/upload/${userId}`, payload, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            })

            localStorage.setItem("user", JSON.stringify({ ...res.data, token }))
            setAdmin({ ...res.data, token })
            alert("Profile image uploaded successfully")
        } catch (err) {
            console.error(err)
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.")
                navigate("/login")
                return
            }
            const message = err.response?.data?.message || err.response?.data || "Upload failed"
            alert(typeof message === "string" ? message : "Upload failed")
        }
    }

    const handleSave = async () => {
        try {
            const res = await api.put(`/user/update/${admin.id}`, formData)
            const token = admin?.token || JSON.parse(localStorage.getItem("user") || "{}")?.token
            localStorage.setItem("user", JSON.stringify({ ...res.data, token }))
            setAdmin({ ...res.data, token })
            setEditMode(false)
            alert("Profile updated successfully")
        } catch (err) {
            console.error(err)
            alert("Update failed")
        }
    }

    const handlePasswordChange = async () => {
        setPasswordError("")
        setPasswordSuccess("")

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError("All fields are required")
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match")
            return
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters")
            return
        }

        try {
            await api.post(`/user/change-password/${admin.id}`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
            setPasswordSuccess("Password changed successfully")
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
            setTimeout(() => {
                setShowPasswordModal(false)
                setPasswordSuccess("")
            }, 2000)
        } catch (err) {
            setPasswordError(err.response?.data?.message || "Failed to change password")
        }
    }

    if (!admin) {
        return <div className="admin-page"><div className="loading-state"><div className="loading-spinner"></div></div></div>
    }

    return (
        <div className="admin-page">
            <div className="admin-page-container">
                <div className="admin-page-header">
                    <div className="admin-page-header-left">
                        <h1>Admin Profile</h1>
                        <p>View and manage your admin profile.</p>
                    </div>
                </div>

                <div className="admin-page-content">
                    <div className="admin-card">
                        <div className="admin-profile-layout">
                            <div className="admin-profile-avatar-area">
                                {admin.profileImage ? (
                                    <img
                                        src={admin.profileImage.startsWith("http") ? admin.profileImage : `http://localhost:8080/uploads/${admin.profileImage}`}
                                        alt="profile"
                                        className="admin-profile-image"
                                    />
                                ) : (
                                    <div className="admin-profile-placeholder">
                                        {admin.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {editMode && (
                                    <div className="admin-profile-upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        {file && (
                                            <button className="submit-btn" onClick={uploadImage}>
                                                Upload Image
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="admin-profile-details">
                                <h3 className="admin-card-title">Profile Details</h3>

                                <div className="admin-profile-fields">
                                    <div className="admin-profile-row">
                                        <span>Name</span>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        ) : (
                                            <strong>{admin.name}</strong>
                                        )}
                                    </div>

                                    <div className="admin-profile-row">
                                        <span>Email</span>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        ) : (
                                            <strong>{admin.email}</strong>
                                        )}
                                    </div>

                                    <div className="admin-profile-row">
                                        <span>Phone</span>
                                        {editMode ? (
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        ) : (
                                            <strong>{admin.phone || "Not set"}</strong>
                                        )}
                                    </div>

                                    <div className="admin-profile-row">
                                        <span>Role</span>
                                        <span className="status-badge confirmed">{admin.role}</span>
                                    </div>
                                </div>

                                <div className="admin-profile-actions">
                                    {editMode ? (
                                        <>
                                            <button className="submit-btn" onClick={handleSave}>Save Changes</button>
                                            <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="submit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
                                            <button className="submit-btn admin-secondary-btn" onClick={() => setShowPasswordModal(true)}>
                                                Change Password
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {showPasswordModal && (
                        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h3>Change Password</h3>

                                {passwordError && <div className="modal-error">{passwordError}</div>}
                                {passwordSuccess && <div className="modal-success">{passwordSuccess}</div>}

                                <div className="modal-field">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    />
                                </div>

                                <div className="modal-field">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                </div>

                                <div className="modal-field">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button className="submit-btn" onClick={handlePasswordChange}>Change Password</button>
                                    <button className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminProfile
