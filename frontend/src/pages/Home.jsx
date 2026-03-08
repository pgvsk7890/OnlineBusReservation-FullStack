// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import api from "../services/api"
// function Home() {

// const [buses,setBuses] = useState([])
// const [from,setFrom] = useState("")
// const [to,setTo] = useState("")
// const [date,setDate] = useState("")
// const [loading,setLoading] = useState(true)

// useEffect(()=>{
// fetchAllBuses()
// },[])

// const fetchAllBuses = async ()=>{

// try{

// const res = await api.get("/bus/all")
// setBuses(res.data)

// }catch(err){
// console.log(err)
// }finally{
// setLoading(false)
// }

// }

// const searchBus = async ()=>{

// setLoading(true)

// try{

// const res = await api.get(`/bus/search?from=${from}&to=${to}&date=${date}`)
// setBuses(res.data)

// }catch(err){
// console.log(err)
// }finally{
// setLoading(false)
// }

// }

// return(

// <div className="home-page">

// {/* NAVBAR */}
// {/* <UserNavbar/> */}

// {/* HERO */}

// <div className="hero">

// <h1>Find Your Perfect Bus</h1>

// <p>Book comfortable bus tickets at the best prices</p>

// <div className="search-box">

// <input
// type="text"
// placeholder="From City"
// value={from}
// onChange={(e)=>setFrom(e.target.value)}
// />

// <input
// type="text"
// placeholder="To City"
// value={to}
// onChange={(e)=>setTo(e.target.value)}
// />

// <input
// type="date"
// value={date}
// onChange={(e)=>setDate(e.target.value)}
// />

// <button onClick={searchBus}>
// Search Bus
// </button>

// </div>

// </div>

// {/* BUS LIST */}

// <div className="bus-section">

// <h2>Available Buses</h2>

// {loading ? (

// <p>Loading buses...</p>

// ) : (

// <div className="bus-grid">

// {buses.map(bus=>(

// <div className="bus-card" key={bus.id}>

// <h3>{bus.busName}</h3>

// <p>{bus.busNumber} • {bus.busType}</p>

// <p>{bus.fromCity} → {bus.toCity}</p>

// <p>{bus.departureTime} - {bus.arrivalTime}</p>
// <p>{bus.date}</p>

// <div className="bus-price">

// <span>Seater ₹{bus.seaterPrice}</span>

// <span>Sleeper ₹{bus.sleeperPrice}</span>

// </div>

// <Link
// to={`/seats/${bus.id}`}
// className="seat-btn"
// >

// View Seats

// </Link>

// </div>

// ))}

// </div>

// )}

// </div>

// </div>

// )

// }

// export default Home


import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

function Home() {

const [buses, setBuses] = useState([])
const [from, setFrom] = useState("")
const [to, setTo] = useState("")
const [date, setDate] = useState("")
const [loading, setLoading] = useState(true)

useEffect(() => {
fetchAllBuses()
}, [])

const fetchAllBuses = async () => {


try {

  const res = await api.get("/bus/all")
  setBuses(res.data)

} catch (err) {
  console.log(err)
} finally {
  setLoading(false)
}


}

const searchBus = async () => {


setLoading(true)

try {

  const res = await api.get(`/bus/search?from=${from}&to=${to}&date=${date}`)
  setBuses(res.data)

} catch (err) {
  console.log(err)
} finally {
  setLoading(false)
}


}

return (


<div className="home-page">

  {/* HERO */}

  <div className="hero">

    <h1>Find Your Perfect Bus</h1>

    <p>Book comfortable bus tickets at the best prices</p>

    <div className="search-box">

      <input
        type="text"
        placeholder="From City"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <input
        type="text"
        placeholder="To City"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={searchBus}>
        Search Bus
      </button>

    </div>

  </div>

  {/* BUS LIST */}

  <div className="bus-section">

    <h2>Available Buses</h2>

    {loading ? (

      <p>Loading buses...</p>

    ) : (

      <div className="bus-grid">

        {buses.map((bus) => (

          <div className="bus-card" key={bus.id}>

            <h3>{bus.busName}</h3>

            <p>{bus.busNumber} • {bus.busType}</p>

            <p>{bus.fromCity} → {bus.toCity}</p>

            <p>{bus.departureTime} - {bus.arrivalTime}</p>

            <p>
              {bus.travelDate
                ? new Date(bus.travelDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })
                : "Date not available"}
            </p>

            <div className="bus-price">

              <span>Seater ₹{bus.seaterPrice}</span>

              <span>Sleeper ₹{bus.sleeperPrice}</span>

            </div>

            <Link
              to={`/seats/${bus.id}`}
              className="seat-btn"
            >
              View Seats
            </Link>

          </div>

        ))}

      </div>

    )}

  </div>

</div>


)

}

export default Home
