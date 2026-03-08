import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function UserProfile(){

const [user,setUser] = useState(null)
const [file,setFile] = useState(null)
const [editMode,setEditMode] = useState(false)
const navigate = useNavigate()

const [formData,setFormData] = useState({
name:"",
email:"",
phone:""
})

useEffect(()=>{

const loadProfile = async () => {
const storedUser = localStorage.getItem("user")

if(!storedUser){
navigate("/login")
return
}

let sessionUser
try{
sessionUser = JSON.parse(storedUser)
}catch{
localStorage.removeItem("user")
navigate("/login")
return
}

if(sessionUser.role==="ADMIN"){
navigate("/admin/profile")
return
}

if(sessionUser.role!=="USER"){
localStorage.removeItem("user")
navigate("/login")
return
}

try{
const res = await api.get(`/user/${sessionUser.id}`)
const freshUser = res.data

setUser(freshUser)
setFormData({
name:freshUser.name || "",
email:freshUser.email || "",
phone:freshUser.phone || ""
})

const token = sessionUser.token
localStorage.setItem("user",JSON.stringify({
...freshUser,
token
}))
}catch{
localStorage.removeItem("user")
navigate("/login")
}
}

loadProfile()

},[navigate])


const uploadImage = async ()=>{

if(!file){
alert("Select image")
return
}

try{

const data = new FormData()
data.append("file",file)

const res = await api.post(`/user/upload/${user.id}`,data,{
headers:{ "Content-Type":"multipart/form-data"}
})

const token = user?.token || JSON.parse(localStorage.getItem("user") || "{}")?.token
localStorage.setItem("user",JSON.stringify({...res.data,token}))
setUser({...res.data,token})

setFile(null)

alert("Profile image updated")

}catch(err){

console.log(err)
alert("Upload failed")

}

}


const handleSave = async ()=>{

try{

const res = await api.put(`/user/update/${user.id}`,formData)

const token = user?.token || JSON.parse(localStorage.getItem("user") || "{}")?.token
localStorage.setItem("user",JSON.stringify({...res.data,token}))

setUser({...res.data,token})
setEditMode(false)

alert("Profile updated")

}catch(err){

console.log(err)
alert("Update failed")

}

}


if(!user){

return(

<div className="profile-loading">
Loading...
</div>

)

}


return(

<div className="profile-page">

<div className="profile-container">

<h2>My Profile</h2>

<div className="profile-card">

{/* LEFT SIDE (IMAGE) */}

<div className="profile-left">

{user.profileImage ?

<img
src={`http://localhost:8080/uploads/${user.profileImage}`}
alt="profile"
/>

:

<div className="profile-avatar">
{user.name?.charAt(0).toUpperCase()}
</div>

}

{/* Upload section visible only in edit mode */}

{editMode && (

<div className="upload-section">

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

{file && (

<button onClick={uploadImage}>
Upload Photo
</button>

)}

</div>

)}

</div>



{/* RIGHT SIDE (DETAILS) */}

<div className="profile-right">

<div className="profile-field">

<label>Name</label>

{editMode ?

<input
value={formData.name}
onChange={(e)=>setFormData({...formData,name:e.target.value})}
/>

:

<p>{user.name}</p>

}

</div>


<div className="profile-field">

<label>Email</label>

{editMode ?

<input
value={formData.email}
onChange={(e)=>setFormData({...formData,email:e.target.value})}
/>

:

<p>{user.email}</p>

}

</div>


<div className="profile-field">

<label>Phone</label>

{editMode ?

<input
value={formData.phone}
onChange={(e)=>setFormData({...formData,phone:e.target.value})}
/>

:

<p>{user.phone || "Not set"}</p>

}

</div>


{/* BUTTONS */}

<div className="profile-buttons">

{editMode ?

<>

<button onClick={handleSave}>
Save
</button>

<button onClick={()=>setEditMode(false)}>
Cancel
</button>

</>

:

<button onClick={()=>setEditMode(true)}>
Edit Profile
</button>

}

</div>

</div>

</div>

</div>

</div>

)

}

export default UserProfile
