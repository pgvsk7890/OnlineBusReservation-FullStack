import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useState } from "react"
import "../../App.css"

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  const navigate = useNavigate()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const closeSidebar = () => setSidebarOpen(false)

  const navItems = [
    { path: "/admin", icon: "dashboard", label: "Dashboard", exact: true },
    { path: "/admin/add-bus", icon: "plus", label: "Add Bus" },
    { path: "/admin/manage-buses", icon: "bus", label: "Manage Buses" },
    { path: "/admin/bookings", icon: "book", label: "View Bookings" },
    { path: "/admin/history", icon: "clock", label: "Booking History" },
    { path: "/admin/coupons", icon: "tag", label: "Manage Coupons" },
    { path: "/admin/tickets", icon: "headset", label: "Support Tickets" },
    { path: "/admin/profile", icon: "user", label: "Profile" }
  ]

  const getIcon = (name) => {
    const icons = {
      dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>,
      plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
      bus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6v6" /><path d="M16 6v6" /><rect x="2" y="14" width="20" height="8" rx="2" /><path d="M6 14h12" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
      book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
      clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
      tag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
      headset: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
      user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    }
    return icons[name]
  }

  return (
    <div className="admin-layout">
      <button
        className="admin-mobile-menu-btn"
        type="button"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="admin-mobile-menu-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </span>
        <span>Menu</span>
      </button>

      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}

      <aside className={sidebarOpen ? "admin-sidebar open" : "admin-sidebar"}>
        <div className="admin-sidebar-top">
          <div className="admin-sidebar-mobile-head">
            <span>Admin Menu</span>
            <button className="admin-sidebar-close" type="button" onClick={closeSidebar}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <div className="admin-brand-card">
            <div className="admin-brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
            </div>
            <div className="admin-brand-copy">
              <div className="admin-logo">BusAdmin</div>
              <p>Control routes, bookings, support, and coupons from one place.</p>
            </div>
          </div>

          <div className="admin-section-label">Management</div>

          <nav className="admin-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={closeSidebar}
                className={({ isActive }) => isActive ? "admin-link active" : "admin-link"}
              >
                <span className="admin-link-icon">{getIcon(item.icon)}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-user">
            <div className="admin-avatar">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="admin-user-name">{adminUser?.name || "Admin"}</div>
              <div className="admin-user-email">{adminUser?.email || "admin@bus.com"}</div>
            </div>
          </div>

          <div className="admin-theme-toggle">
            <button
              className="admin-theme-btn"
              onClick={toggleTheme}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              type="button"
            >
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>

          <button
            className="admin-link admin-logout-link"
            onClick={() => {
              closeSidebar()
              handleLogout()
            }}
            type="button"
          >
            <span className="admin-link-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
