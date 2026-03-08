import { useEffect, useState } from "react"
import api from "../services/api"

function MyBookings() {

const [bookings,setBookings] = useState([])
const [loading,setLoading] = useState(true)

const storedUser = localStorage.getItem("user")
const user = storedUser ? JSON.parse(storedUser) : null

useEffect(()=>{

if(!user){
setLoading(false)
return
}

fetchBookings(true)

const intervalId = setInterval(()=>{
fetchBookings(false)
},5000)

return ()=>clearInterval(intervalId)

},[])


const fetchBookings = async (showLoader = true)=>{

if(showLoader){
setLoading(true)
}

try{

const res = await api.get(`/booking/user/${user.id}`)

const validBookings = res.data.filter(
booking => booking.seat && booking.seat.bus
)

setBookings(validBookings)

}catch(err){

console.log(err)
if(showLoader){
alert("Failed to load bookings")
}

}finally{

if(showLoader){
setLoading(false)
}

}

}


return(

<div className="mybookings-page">



<div className="booking-container">

<h2 className="booking-title">My Bookings</h2>

{loading && <p className="loading-text">Loading bookings...</p>}

{!loading && bookings.length === 0 && (
<p className="empty-text">No bookings found</p>
)}

<div className="booking-grid">

{bookings.map((booking)=>{

const seat = booking.seat
const bus = seat.bus

return(

<div className="booking-card" key={booking.id}>

<div className="booking-header">

<h3>{bus.busName}</h3>

<span className={`status ${booking.bookingStatus?.toLowerCase()}`}>
{booking.bookingStatus}
</span>

</div>

<div className="booking-details">

<p>
<b>Route:</b> {bus.fromCity} → {bus.toCity}
</p>

<p>
<b>Seat:</b> {seat.seatNumber}
</p>

<p>
<b>Price:</b> Rs.{seat.price}
</p>

<p>
<b>Payment:</b> {booking.paymentStatus}
</p>

<p>
<b>Passenger:</b> {booking.passengerName || booking.user?.name || user?.name}
</p>

<p>
<b>Age/Gender:</b> {booking.passengerAge || "-"} / {booking.passengerGender || "-"}
</p>

<p>
<b>Phone:</b> {booking.passengerPhone || booking.user?.phone || "Not set"}
</p>

<p>
<b>Date:</b> {bus.travelDate}
</p>

</div>

</div>

)

})}

</div>

</div>

</div>

)

}

export default MyBookings
