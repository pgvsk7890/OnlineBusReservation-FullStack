import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function UserNavbar(){

const [menuOpen,setMenuOpen] = useState(false)
const navigate = useNavigate()

const logout = () => {
localStorage.removeItem("user")
navigate("/login")
}

return(

<nav className="user-navbar">

<div className="navbar-logo">

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<path d="M8 6v6h12V6M8 12v6h12v-6M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"/>
</svg>

<span>Bus Reserve</span>

</div>


<button
className="menu-toggle"
onClick={()=>setMenuOpen(!menuOpen)}
>

{menuOpen ?

"✕"

:

"☰"

}

</button>


<div className={`nav-links ${menuOpen ? "active" : ""}`}>

<Link to="/home" onClick={()=>setMenuOpen(false)}>
Home
</Link>

<Link to="/mybookings" onClick={()=>setMenuOpen(false)}>
Bookings
</Link>

<Link to="/offers" onClick={()=>setMenuOpen(false)}>
Offers
</Link>

<Link to="/support" onClick={()=>setMenuOpen(false)}>
Support
</Link>

<Link to="/profile" onClick={()=>setMenuOpen(false)}>
Profile
</Link>

<button className="logout-btn" onClick={logout}>
Logout
</button>

</div>

</nav>

)

}

export default UserNavbar