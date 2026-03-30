import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
// import "./AdminSidebar.css"
import "../App.css"

function AdminSideBar({ setSidebarOpen }) {

    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [adminUser] = useState(() => {
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                return JSON.parse(userStr)
            } catch {
                return null
            }
        }
        return null
    })

    const logout = () => {
        localStorage.removeItem("user")
        navigate("/login")
    }

    const navItems = [
        { path: "/admin", icon: "dashboard", label: "Dashboard", exact: true },
        { path: "/admin/add-bus", icon: "add_bus", label: "Add Bus" },
        { path: "/admin/manage-buses", icon: "manage_buses", label: "Manage Buses" },
        { path: "/admin/bookings", icon: "bookings", label: "View Bookings" },
        { path: "/admin/history", icon: "history", label: "Booking History" },
        { path: "/admin/coupons", icon: "coupons", label: "Manage Coupons" },
        { path: "/admin/tickets", icon: "support", label: "Support Tickets" },
        { path: "/admin/profile", icon: "profile", label: "Profile" },
    ]

    const getIcon = (icon) => {
        const icons = {
            dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
            add_bus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="6" r="3"/><path d="M5 10h14l-1.5 9h-11z"/><path d="M19 19a2 2 0 104 0"/></svg>,
            manage_buses: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 10h14l-1.5 9h-11z"/><circle cx="12" cy="6" r="3"/><circle cx="5.5" cy="19" r="2"/><circle cx="18.5" cy="19" r="2"/></svg>,
            bookings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
            history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            coupons: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
            support: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
            profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        }
        return icons[icon] || null
    }

    const handleNavClick = () => {
        if (window.innerWidth <= 900) {
            setSidebarOpen(false)
        }
    }

    return (
        <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="6" r="3"/>
                            <path d="M5 10h14l-1.5 9h-11z"/>
                        </svg>
                    </div>
                    {!collapsed && <span className="logo-text">BusAdmin</span>}
                </div>
                <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
                    </svg>
                </button>
            </div>

            {!collapsed && adminUser && (
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{adminUser.name || "Admin"}</span>
                        <span className="sidebar-user-email">{adminUser.email || "admin@bus.com"}</span>
                    </div>
                </div>
            )}

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.path}
                        to={item.path} 
                        end={item.exact}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        <span className="nav-icon">{getIcon(item.icon)}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={logout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSideBar
