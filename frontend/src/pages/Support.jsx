import { useEffect, useState } from "react"
import api from "../services/api"


function Support(){

const [subject,setSubject] = useState("")
const [message,setMessage] = useState("")
const [tickets,setTickets] = useState([])

const storedUser = localStorage.getItem("user")
const user = storedUser ? JSON.parse(storedUser) : null

useEffect(()=>{
fetchTickets()
},[])

const fetchTickets = async()=>{

try{

const res = await api.get(`/ticket/user/${user.id}`)
setTickets(res.data)

}catch(err){

console.log(err)

}

}

const createTicket = async(e)=>{

e.preventDefault()

if(!subject || !message){
alert("Please fill all fields")
return
}

try{

await api.post(`/ticket/create/${user.id}`,{
subject:subject,
message:message
})

setSubject("")
setMessage("")

fetchTickets()

alert("Ticket submitted successfully")

}catch(err){

console.log(err)
alert("Failed to create ticket")

}

}

return(

<div className="support-page">


<div className="support-container">

<h2 className="support-title">Support Center</h2>


{/* CREATE TICKET */}

<div className="ticket-form">

<h3>Create Support Ticket</h3>

<form onSubmit={createTicket}>

<input
type="text"
placeholder="Subject"
value={subject}
onChange={(e)=>setSubject(e.target.value)}
/>

<textarea
placeholder="Describe your issue"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<button type="submit">
Submit Ticket
</button>

</form>

</div>


{/* USER TICKETS */}

<div className="ticket-list">

<h3>My Support Tickets</h3>

{tickets.length === 0 && (
<p className="no-ticket">No tickets created</p>
)}

{tickets.map(ticket=>(

<div className="ticket-card" key={ticket.id}>

<h4>{ticket.subject}</h4>

<p className="ticket-message">{ticket.message}</p>

<p className={`ticket-status ${ticket.status?.toLowerCase()}`}>
Status: {ticket.status}
</p>

{ticket.adminResponse && (

<div className="admin-response">

<b>Admin Response</b>

<p>{ticket.adminResponse}</p>

</div>

)}

</div>

))}

</div>

</div>

</div>

)

}

export default Support