import { useState, useEffect } from "react"
import api from "../services/api"

function Offers(){

const [coupons,setCoupons] = useState([])
const [message,setMessage] = useState(null)
const [copiedId,setCopiedId] = useState(null)

useEffect(()=>{
fetchCoupons()
},[])

const fetchCoupons = async ()=>{

try{

const res = await api.get("/coupon/active")
setCoupons(res.data)

}catch(err){
console.log(err)
}

}

const copyToClipboard = (code,id)=>{

navigator.clipboard.writeText(code)

setCopiedId(id)

setMessage({
type:"success",
text:"Coupon code copied!"
})

setTimeout(()=>{
setCopiedId(null)
},2000)

}

return(

<div className="offers-page">

<div className="offers-container">

<div className="offers-header">

<h1>Offers & Coupons</h1>

<p>Apply coupon codes to get discounts on your booking</p>

</div>


{message && (

<div className={`coupon-message ${message.type}`}>
{message.text}
</div>

)}



<div className="available-offers">

<h3>Available Offers</h3>

{coupons.length === 0 ? (

<p className="no-offers">
No active offers available.
</p>

) : (

<div className="offers-grid">

{coupons.map(coupon=>(

<div className="offer-card" key={coupon.id}>

<div className="offer-discount">
{coupon.discountPercentage}% OFF
</div>

<div className="offer-code">
{coupon.couponCode}
</div>

<p className="offer-description">
{coupon.description || "Get instant discount on booking"}
</p>

<ul className="offer-terms">

<li>Min booking: ₹{coupon.minAmount}</li>

{coupon.maxDiscount > 0 && (
<li>Max discount: ₹{coupon.maxDiscount}</li>
)}

{coupon.usageLimit > 0 && (
<li>Limit: {coupon.usageLimit} uses</li>
)}

<li>Valid until: {coupon.validUntil}</li>

</ul>


{/* COPY CODE SECTION */}

<div className="copy-code">

<span>{coupon.couponCode}</span>

<button
className={`copy-btn ${copiedId === coupon.id ? "copied" : ""}`}
onClick={()=>copyToClipboard(coupon.couponCode,coupon.id)}
>

{copiedId === coupon.id ? "Copied" : "Copy Code"}

</button>

</div>

</div>

))}

</div>

)}

</div>

</div>

</div>

)

}

export default Offers