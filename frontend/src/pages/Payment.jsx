import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../services/api"

function Payment(){

const location = useLocation()
const navigate = useNavigate()

const seats = location.state?.seats || []

const [paid,setPaid] = useState(false)
const [utrNumber,setUtrNumber] = useState("")
const [qrSecondsLeft,setQrSecondsLeft] = useState(420)
const [couponCode,setCouponCode] = useState("")
const [appliedCoupon,setAppliedCoupon] = useState(null)
const [couponMessage,setCouponMessage] = useState({type:"",text:""})

const storedUser = localStorage.getItem("user")
const user = storedUser ? JSON.parse(storedUser) : null
const [passengerDetails,setPassengerDetails] = useState(()=>{
const initial = {}
seats.forEach((seat,index)=>{
initial[seat.id] = {
name:index===0 ? (user?.name || "") : "",
age:"",
gender:"",
phone:index===0 ? (user?.phone || "") : ""
}
})
return initial
})

const amount = seats.reduce((sum,seat)=>sum + seat.price,0)
const finalAmount = appliedCoupon ? amount - appliedCoupon.discount : amount

const upiLink = encodeURIComponent(
`upi://pay?pa=7013147368@mbk&pn=BusBooking&am=${finalAmount}&cu=INR&tn=SeatBooking`
)

const isQrExpired = qrSecondsLeft <= 0

useEffect(()=>{
if(isQrExpired || paid){
return
}

const timer = setInterval(()=>{
setQrSecondsLeft((prev)=>Math.max(prev-1,0))
},1000)

return ()=>clearInterval(timer)
},[isQrExpired,paid])

const formatTimer = (seconds)=>{
const mins = Math.floor(seconds/60)
const secs = seconds % 60
return `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`
}


const applyCoupon = async ()=>{

if(!couponCode.trim()){
setCouponMessage({type:"error",text:"Enter coupon code"})
return
}

try{

const res = await api.post("/coupon/apply",{
couponCode:couponCode,
amount:amount
})

setAppliedCoupon({
code:couponCode,
discount:res.data.discount
})

setCouponMessage({
type:"success",
text:`Coupon applied! You save Rs.${res.data.discount}`
})

}catch(err){

setCouponMessage({
type:"error",
text:err.response?.data?.message || "Invalid coupon"
})

setAppliedCoupon(null)

}

}


const removeCoupon = ()=>{
setAppliedCoupon(null)
setCouponCode("")
setCouponMessage({type:"",text:""})
}

const updatePassengerDetail = (seatId,field,value)=>{
setPassengerDetails((prev)=>({
...prev,
[seatId]:{
...prev[seatId],
[field]:value
}
}))
}


const handlePayment = async ()=>{

if(!utrNumber.trim()){
alert("UTR number is mandatory")
return
}

if(isQrExpired){
alert("QR validation time expired. Please try booking again.")
return
}

try{

const seatIds = seats.map(seat=>seat.id)
const passengers = seats.map((seat)=>{
const detail = passengerDetails[seat.id] || {}
return {
seatId:seat.id,
name:(detail.name || "").trim(),
age:Number(detail.age),
gender:(detail.gender || "").trim(),
phone:(detail.phone || "").trim()
}
})

for(const passenger of passengers){
if(!passenger.name){
alert("Passenger name is required for all seats")
return
}
if(!passenger.age || passenger.age <= 0){
alert("Valid passenger age is required for all seats")
return
}
if(!passenger.gender){
alert("Passenger gender is required for all seats")
return
}
}

await api.post("/booking/createBooking",{
seatIds:seatIds,
userId:user?.id,
utrNumber:utrNumber.trim().toUpperCase(),
passengers:passengers,
couponCode:appliedCoupon ? appliedCoupon.code : null
})

setPaid(true)

}catch(err){

console.log(err)
alert(err.response?.data || "Booking failed")

}

}



return(

<div className="payment-page">

{/* HEADER */}

<div className="payment-header">

<button onClick={()=>navigate(-1)} className="back-btn">
Back
</button>

<h2>Payment</h2>

</div>



<div className="payment-container">

{/* LEFT CARD */}

<div className="payment-card">

<h3>Passenger Details</h3>

<div className="detail-row">
<span>Name</span>
<b>{user?.name}</b>
</div>

<div className="detail-row">
<span>Email</span>
<b>{user?.email}</b>
</div>

<div className="detail-row">
<span>User ID</span>
<b>#{user?.id}</b>
</div>

<hr/>

<h4>Seat Summary</h4>

{seats.map(seat=>(

<div className="seat-passenger-block" key={seat.id}>
<div className="seat-row">
<span>Seat {seat.seatNumber}</span>
<b>Rs.{seat.price}</b>
</div>

<div className="passenger-form-grid">
<input
type="text"
value={passengerDetails[seat.id]?.name || ""}
onChange={(e)=>updatePassengerDetail(seat.id,"name",e.target.value)}
placeholder={`Passenger name for ${seat.seatNumber}`}
/>
<input
type="number"
value={passengerDetails[seat.id]?.age || ""}
onChange={(e)=>updatePassengerDetail(seat.id,"age",e.target.value)}
placeholder="Age"
min="1"
/>
<select
value={passengerDetails[seat.id]?.gender || ""}
onChange={(e)=>updatePassengerDetail(seat.id,"gender",e.target.value)}
>
<option value="">Select gender</option>
<option value="MALE">Male</option>
<option value="FEMALE">Female</option>
<option value="OTHER">Other</option>
</select>
<input
type="text"
value={passengerDetails[seat.id]?.phone || ""}
onChange={(e)=>updatePassengerDetail(seat.id,"phone",e.target.value)}
placeholder="Phone (optional)"
/>
</div>
</div>

))}


{/* COUPON */}

<div className="coupon-section">

<h4>Apply Coupon</h4>

{!appliedCoupon ?

<div className="coupon-input">

<input
type="text"
value={couponCode}
placeholder="Enter coupon code"
onChange={(e)=>setCouponCode(e.target.value.toUpperCase())}
/>

<button onClick={applyCoupon}>
Apply
</button>

</div>

:

<div className="coupon-applied">

<span>{appliedCoupon.code}</span>
<b>-Rs.{appliedCoupon.discount}</b>

<button className="coupon-remove-btn" onClick={removeCoupon}>
Remove
</button>

</div>

}

{couponMessage.text &&

<p className={`coupon-msg ${couponMessage.type}`}>
{couponMessage.text}
</p>

}

</div>


<hr/>

<div className="total-section">

<p>Total Amount</p>

{appliedCoupon && <small>Rs.{amount}</small>}

<h2>Rs.{finalAmount}</h2>

</div>

</div>



{/* PAYMENT CARD */}

<div className="payment-card">

<h3>Scan & Pay</h3>

<img
src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${upiLink}`}
alt="QR"
/>

<p>Scan QR using UPI to pay Rs.{finalAmount}</p>

<p className={`qr-timer ${isQrExpired ? "expired" : ""}`}>
{isQrExpired ? "QR expired" : `QR valid for ${formatTimer(qrSecondsLeft)}`}
</p>

<div className="input-group" style={{marginTop:"12px", width:"100%"}}>
<label>UTR Number *</label>
<input
type="text"
value={utrNumber}
onChange={(e)=>setUtrNumber(e.target.value)}
placeholder="Enter UTR number after payment"
required
/>
</div>

<button className="pay-btn" onClick={handlePayment} disabled={isQrExpired || paid}>
I Have Paid
</button>

<button className="cancel-btn" onClick={()=>navigate(-1)}>
Cancel
</button>


{paid && (

<div className="payment-success">

<h4>Payment Submitted!</h4>

<p>Your booking is pending admin approval</p>

<div className="payment-success-details">
<p><b>Passenger:</b> {user?.name}</p>
<p><b>Email:</b> {user?.email}</p>
<p><b>Phone:</b> {user?.phone || "Not set"}</p>
<p><b>UTR:</b> {utrNumber.trim().toUpperCase()}</p>
<p><b>Seats:</b> {seats.map((seat)=>seat.seatNumber).join(", ")}</p>
{seats.map((seat)=>(
<p key={seat.id}>
<b>{seat.seatNumber}:</b> {(passengerDetails[seat.id]?.name || "-")} | {(passengerDetails[seat.id]?.age || "-")} | {(passengerDetails[seat.id]?.gender || "-")}
</p>
))}
</div>

<button className="go-home-btn" onClick={()=>navigate("/home")}>
Go Home
</button>

</div>

)}

</div>

</div>

</div>

)

}

export default Payment
