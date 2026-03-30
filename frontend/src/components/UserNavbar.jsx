import { useMemo, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import ThemeToggle from "./ThemeToggle"

function UserNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const userInitial = useMemo(() => {
    return user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"
  }, [user?.name])

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="user-navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 6v6h12V6M8 12v6h12v-6M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>

          <div className="navbar-brand-copy">
            <span>Bus Reserve</span>
            <small>Fast and simple booking</small>
          </div>
        </div>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        type="button"
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <div className="nav-links-group">
          <NavLink to="/home" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/mybookings" onClick={closeMenu}>
            Bookings
          </NavLink>

          <NavLink to="/offers" onClick={closeMenu}>
            Offers
          </NavLink>

          <NavLink to="/support" onClick={closeMenu}>
            Support
          </NavLink>

          <ThemeToggle compact />
        </div>

        <NavLink to="/profile" className="navbar-user navbar-user-link" onClick={closeMenu}>
          <div className="navbar-user-avatar">{userInitial}</div>
          <div className="navbar-user-copy">
            <strong>{user?.name || "Traveler"}</strong>
            <small>{user?.email || "Manage your account"}</small>
          </div>
        </NavLink>

        <button className="logout-btn" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default UserNavbar
