import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function Register(){

const [name,setName]=useState("")
const [email,setEmail]=useState("")
const [phone,setPhone]=useState("")
const [password,setPassword]=useState("")

const [loading,setLoading]=useState(false)
const [error,setError]=useState("")

const navigate = useNavigate()

const register = async(e)=>{

e.preventDefault()

setLoading(true)
setError("")

try{

await api.post("/auth/register",{
name,
email,
phone,
password
})

navigate("/login")

}catch(err){

setError(err.response?.data?.message || "Registration failed")

}finally{
setLoading(false)
}

}

return(

<div className="auth-page">
<div className="login-container">

<h1 className="login-title">Create Account</h1>

<p className="login-subtitle">
Join us for a comfortable journey
</p>

{error && <div className="error-box">{error}</div>}

<form onSubmit={register}>

<div className="input-group">
<label>Name</label>
<input
type="text"
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Enter name"
required
/>
</div>

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
<label>Phone</label>
<input
type="tel"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
placeholder="Enter phone number"
required
/>
</div>

<div className="input-group">
<label>Password</label>
<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Create password"
required
/>
</div>

<button className="login-btn">
{loading ? "Creating..." : "Create Account"}
</button>

</form>

<div className="login-footer">
Already have an account? <Link to="/login">Sign In</Link>
</div>

</div>
</div>

)

}

export default Register
