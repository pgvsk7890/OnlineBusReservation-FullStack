import { useState } from "react"
import api from "../../services/api"
import { useNavigate } from "react-router-dom"


function AddBus() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [busName, setBusName] = useState("")
    const [busNumber, setBusNumber] = useState("")
    const [fromCity, setFromCity] = useState("")
    const [toCity, setToCity] = useState("")
    const [departureTime, setDepartureTime] = useState("")
    const [arrivalTime, setArrivalTime] = useState("")
    const [busType, setBusType] = useState("AC")
    const [seaterPrice, setSeaterPrice] = useState("")
    const [sleeperPrice, setSleeperPrice] = useState("")

    const addBus = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const bus = {
                busName,
                busNumber,
                fromCity,
                toCity,
                departureTime,
                arrivalTime,
                busType,
                seaterPrice,
                sleeperPrice
            }

            await api.post("/bus/add", bus)
            alert("Bus Added Successfully")
            navigate("/admin/manage-buses")
        } catch {
            alert("Failed to add bus")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page-container">
                <div className="admin-page-header">
                    <div className="admin-page-header-left">
                        <h1>Add New Bus</h1>
                        <p>Fill in the details to add a new bus to your fleet.</p>
                    </div>
                </div>
                
                <div className="admin-page-content">
                    <div className="admin-card">
                <form onSubmit={addBus} className="admin-form">
                    <div className="form-group">
                        <label>Bus Name</label>
                        <input
                            type="text"
                            placeholder="Enter Bus Name"
                            value={busName}
                            onChange={(e) => setBusName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Bus Number</label>
                        <input
                            type="text"
                            placeholder="Enter Bus Number"
                            value={busNumber}
                            onChange={(e) => setBusNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>From City</label>
                        <input
                            type="text"
                            placeholder="Enter From City"
                            value={fromCity}
                            onChange={(e) => setFromCity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>To City</label>
                        <input
                            type="text"
                            placeholder="Enter To City"
                            value={toCity}
                            onChange={(e) => setToCity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Departure Time</label>
                        <input
                            type="time"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Arrival Time</label>
                        <input
                            type="time"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Bus Type</label>
                        <select value={busType} onChange={(e) => setBusType(e.target.value)}>
                            <option value="AC">AC</option>
                            <option value="NON_AC">NON AC</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Seater Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Enter Seater Price"
                            value={seaterPrice}
                            onChange={(e) => setSeaterPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Sleeper Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Enter Sleeper Price"
                            value={sleeperPrice}
                            onChange={(e) => setSleeperPrice(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Adding..." : "Add Bus"}
                    </button>
                </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBus
