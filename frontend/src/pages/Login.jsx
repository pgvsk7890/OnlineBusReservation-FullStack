import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function Login() {

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [loading,setLoading]=useState(false)
const [error,setError]=useState("")

const [loginMode,setLoginMode]=useState("password")

const [otpEmail,setOtpEmail]=useState("")
const [otpSent,setOtpSent]=useState(false)
const [otp,setOtp]=useState(["","","","","",""])
const [resendTimer,setResendTimer]=useState(0)

const navigate = useNavigate()


useEffect(()=>{

if(resendTimer>0){

const timer=setTimeout(()=>{
setResendTimer(resendTimer-1)
},1000)

return ()=>clearTimeout(timer)

}

},[resendTimer])



/* PASSWORD LOGIN */

const login = async(e)=>{

e.preventDefault()

setLoading(true)
setError("")

try{

const res = await api.post("/auth/login",{
email,
password
})

const userData = res.data.user
userData.token = res.data.token

localStorage.setItem("user",JSON.stringify(userData))

if(userData.role==="ADMIN"){
navigate("/admin")
}else{
navigate("/home")
}

}catch(err){

setError(err.response?.data?.message || "Invalid credentials")

}finally{
setLoading(false)
}

}



/* SEND OTP */

const sendOtp = async()=>{

const normalizedEmail = otpEmail.trim().toLowerCase()

if(!normalizedEmail){
setError("Enter your email")
return
}

setLoading(true)
setError("")

try{

await api.post("/auth/send-otp",{email:normalizedEmail})

setOtpSent(true)
setOtp(["","","","","",""])
setResendTimer(60)

}catch(err){

setError(err.response?.data?.message || "Failed to send OTP")

}finally{
setLoading(false)
}

}



/* VERIFY OTP */

const verifyOtp = async(e)=>{

e.preventDefault()

const normalizedEmail = otpEmail.trim().toLowerCase()
const otpValue = otp.join("").trim()

if(!/^\d{6}$/.test(otpValue)){
setError("Enter valid 6-digit OTP")
return
}

setLoading(true)
setError("")

try{

const res = await api.post("/auth/verify-otp",{
email:normalizedEmail,
otp:otpValue
})

const userData = res.data.user
userData.token = res.data.token

localStorage.setItem("user",JSON.stringify(userData))

if(userData.role==="ADMIN"){
navigate("/admin")
}else{
navigate("/home")
}

}catch(err){

setError(err.response?.data?.message || "Invalid OTP")

}finally{
setLoading(false)
}

}



/* OTP INPUT HANDLING */

const handleOtpChange=(index,value)=>{

if(value.length>1) value=value[0]

if(!/^\d*$/.test(value)) return

const newOtp=[...otp]

newOtp[index]=value

setOtp(newOtp)

if(value && index<5){
document.getElementById(`otp-${index+1}`).focus()
}

}

const handleOtpKeyDown=(index,e)=>{

if(e.key==="Backspace" && !otp[index] && index>0){
document.getElementById(`otp-${index-1}`).focus()
}

}



return(

<div className="auth-page">
<div className="login-container">

<h1 className="login-title">Welcome Back</h1>

<p className="login-subtitle">
Sign in to continue your journey
</p>


{/* LOGIN MODE SWITCH */}

<div className="login-mode-switch">

<button
className={`mode-btn ${loginMode==="password" ? "active" : ""}`}
onClick={()=>{setLoginMode("password");setOtpSent(false)}}
type="button"
>
Password
</button>

<button
className={`mode-btn ${loginMode==="otp" ? "active" : ""}`}
onClick={()=>{setLoginMode("otp");setOtpSent(false)}}
type="button"
>
OTP Login
</button>

</div>


{error && <div className="error-box">{error}</div>}



{/* PASSWORD LOGIN */}

{loginMode==="password" && (

<form onSubmit={login}>

<div className="input-group">
<label>Email</label>
<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Enter email"
required
/>
</div>

<div className="input-group">
<label>Password</label>
<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Enter password"
required
/>
</div>

<button className="login-btn">
{loading ? "Signing In..." : "Sign In"}
</button>

</form>

)}



{/* OTP LOGIN */}

{loginMode==="otp" && !otpSent && (

<div>

<div className="input-group">
<label>Email</label>
<input
type="email"
value={otpEmail}
onChange={(e)=>setOtpEmail(e.target.value)}
placeholder="Enter email"
required
/>
</div>

<button
className="login-btn"
onClick={sendOtp}
>
{loading ? "Sending OTP..." : "Send OTP"}
</button>

</div>

)}



{/* VERIFY OTP */}

{loginMode==="otp" && otpSent && (

<form onSubmit={verifyOtp}>

<div className="otp-container">

{otp.map((digit,index)=>(

<input
key={index}
id={`otp-${index}`}
type="text"
maxLength="1"
value={digit}
onChange={(e)=>handleOtpChange(index,e.target.value)}
onKeyDown={(e)=>handleOtpKeyDown(index,e)}
/>

))}

</div>


<div className="otp-resend-wrap">

{resendTimer>0 ?

<span>Resend OTP in {resendTimer}s</span>

:

<button
className="otp-resend-btn"
type="button"
onClick={sendOtp}
>
Resend OTP
</button>

}

</div>


<button className="login-btn">
{loading ? "Verifying..." : "Verify OTP"}
</button>

</form>

)}



<div className="login-footer">
Don't have an account? <Link to="/register">Create Account</Link>
</div>

</div>
</div>

)

}

export default Login
