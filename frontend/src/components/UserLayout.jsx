import { Outlet } from "react-router-dom"
import UserNavbar from "./UserNavbar"

function UserLayout() {
  return (
    <div className="user-layout">
      <UserNavbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}

export default UserLayout
