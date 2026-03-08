import { Outlet } from "react-router-dom"
import UserNavbar from "./UserNavbar"

function UserLayout() {

return (

<div>

<UserNavbar/>

<div className="main-content">
<Outlet/>
</div>

</div>

)

}

export default UserLayout