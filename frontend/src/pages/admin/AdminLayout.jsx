import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useState, useEffect } from "react"
import "../../App.css"

function AdminLayout() {

const [sidebarOpen, setSidebarOpen] = useState(false)
const navigate = useNavigate()
const [adminUser, setAdminUser] = useState(null)

useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
        try {
            const user = JSON.parse(userStr)
            setAdminUser(user)
        } catch {}
    }
}, [])

const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
}

const handleMobileMenuToggle = () => {
    setSidebarOpen((prev) => !prev)
}

const handleMobileNavClick = () => {
    setSidebarOpen(false)
}

const navItems = [
    { path: "/admin", icon: "dashboard", label: "Dashboard", exact: true },
    { path: "/admin/add-bus", icon: "add", label: "Add Bus" },
    { path: "/admin/manage-buses", icon: "bus", label: "Manage Buses" },
    { path: "/admin/bookings", icon: "bookings", label: "View Bookings" },
    { path: "/admin/history", icon: "history", label: "Booking History" },
    { path: "/admin/coupons", icon: "coupon", label: "Manage Coupons" },
    { path: "/admin/tickets", icon: "support", label: "Support Tickets" },
    { path: "/admin/profile", icon: "profile", label: "Profile" },
]

const getIcon = (icon) => {
    const icons = {
        dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
        add: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="6" r="3"/><path d="M5 10h14l-1.5 9h-11z"/><path d="M19 19a2 2 0 104 0"/></svg>,
        bus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 10h14l-1.5 9h-11z"/><circle cx="12" cy="6" r="3"/><circle cx="5.5" cy="19" r="2"/><circle cx="18.5" cy="19" r="2"/></svg>,
        bookings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
        history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
        coupon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
        support: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
        profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    }
    return icons[icon] || null
}

return (

<div className="admin-layout">

<div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
    <div className="sidebar-header">
        <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="6" r="3"/>
                <path d="M5 10h14l-1.5 9h-11z"/>
            </svg>
            <span>BusAdmin</span>
        </div>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>

    <div className="sidebar-user">
        <div className="sidebar-avatar">
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
        </div>
        <div className="sidebar-user-info">
            <span>{adminUser?.name || "Admin"}</span>
            <small>{adminUser?.email || "admin@bus.com"}</small>
        </div>
    </div>

    <nav className="sidebar-nav">
        {navItems.map((item) => (
            <NavLink 
                key={item.path}
                to={item.path} 
                end={item.exact}
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={handleMobileNavClick}
            >
                <span className="nav-icon">{getIcon(item.icon)}</span>
                <span className="nav-label">{item.label}</span>
            </NavLink>
        ))}
    </nav>

    <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
        </button>
    </div>
</div>

{sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

<div className="admin-main">
    <div className="admin-topbar">
        <button className="menu-btn" onClick={handleMobileMenuToggle} aria-label="Toggle menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        </button>
        <h2>Admin Panel</h2>
        <nav className="admin-desktop-nav">
            {navItems.map((item) => (
                <NavLink
                    key={`desktop-${item.path}`}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    <span className="nav-icon">{getIcon(item.icon)}</span>
                    <span className="nav-label">{item.label}</span>
                </NavLink>
            ))}
        </nav>
        <button className="admin-desktop-logout" onClick={handleLogout}>
            Logout
        </button>
    </div>
    <Outlet/>
</div>

</div>

)

}

export default AdminLayout
