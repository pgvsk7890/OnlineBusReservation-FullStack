import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Seats from "./pages/Seats";
import Payment from "./pages/Payment";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddBus from "./pages/admin/AddBus";
import ManageBuses from "./pages/admin/ManageBuses";
import AdminBookings from "./pages/admin/AdminBookings";
import BookingHistory from "./pages/admin/BookingHistory";
import SupportTickets from "./pages/admin/SupportTickets";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageSeats from "./pages/admin/ManageSeats";
import ManageCoupons from "./pages/admin/ManageCoupons";

import MyBookings from "./pages/MyBookings"
import Support from "./pages/Support"
import UserProfile from "./pages/UserProfile"
import Offers from "./pages/Offers"

import ProtectedRoute from "./components/ProtectedRoute";
import UserLayout from "./components/UserLayout";

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));

function App() {

const userStr = localStorage.getItem("user");

let user = null;

try {
user = userStr ? JSON.parse(userStr) : null;
} catch {
user = null;
}

const getDefaultRoute = () => {
if (!user) return "/login";
return user.role === "ADMIN" ? "/admin" : "/home";
};

return (

<BrowserRouter>

<Routes>

<Route path="/" element={<Navigate to={getDefaultRoute()} />} />

{/* PUBLIC ROUTES */}

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />



{/* USER LAYOUT */}

<Route
element={
<ProtectedRoute allowedRoles={["USER"]}>
<UserLayout/>
</ProtectedRoute>
}
>

<Route path="/home" element={<Home/>}/>
<Route path="/seats/:busId" element={<Seats/>}/>
<Route path="/payment" element={<Payment/>}/>
<Route path="/mybookings" element={<MyBookings/>}/>
<Route path="/support" element={<Support/>}/>
<Route path="/profile" element={<UserProfile/>}/>
<Route path="/offers" element={<Offers/>}/>

</Route>



{/* ADMIN LAYOUT */}

<Route
path="/admin"
element={
<ProtectedRoute allowedRoles={["ADMIN"]}>
<Suspense fallback={<div>Loading...</div>}>
<AdminLayout/>
</Suspense>
</ProtectedRoute>
}
>

<Route index element={<AdminDashboard/>}/>
<Route path="add-bus" element={<AddBus/>}/>
<Route path="manage-buses" element={<ManageBuses/>}/>
<Route path="bookings" element={<AdminBookings/>}/>
<Route path="history" element={<BookingHistory/>}/>
<Route path="tickets" element={<SupportTickets/>}/>
<Route path="profile" element={<AdminProfile/>}/>
<Route path="seats/:busId" element={<ManageSeats/>}/>
<Route path="coupons" element={<ManageCoupons/>}/>

</Route>

</Routes>

</BrowserRouter>

);

}

export default App;
