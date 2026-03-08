import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"


function ManageBuses() {

    const [buses, setBuses] = useState([])
    const [editBus, setEditBus] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        fetchBuses()
    }, [])

    const fetchBuses = async () => {
        try {
            const res = await api.get("/bus/all")
            setBuses(res.data)
        } catch (err) {
            alert("Failed to load buses")
        } finally {
            setLoading(false)
        }
    }

    const deleteBus = async (id) => {
        if (!window.confirm("Delete this bus?")) return

        try {
            await api.delete(`/bus/delete/${id}`)
            alert("Bus deleted successfully")
            fetchBuses()
        } catch (err) {
            alert(err.response?.data || "Delete failed")
        }
    }

    const updateBus = async (e) => {
        e.preventDefault()

        try {
            await api.put(`/bus/update/${editBus.id}`, editBus)
            alert("Bus updated successfully")
            setEditBus(null)
            fetchBuses()
        } catch (err) {
            alert("Update failed")
        }
    }

    if (loading) {
        return <div className="admin-page"><div className="loading-state"><div className="loading-spinner"></div></div></div>
    }

    return (
        <div className="admin-page">
            <div className="admin-page-container">
                <div className="admin-page-header">
                    <div className="admin-page-header-left">
                        <h1>Manage Buses</h1>
                        <p>View, edit, or delete buses from your fleet.</p>
                    </div>
                </div>
                
                <div className="admin-page-content">
                    <div className="admin-card">
                        {buses.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="6" r="3"/>
                            <path d="M5 10h14l-1.5 9h-11z"/>
                        </svg>
                        <h3>No Buses Found</h3>
                        <p>Add some buses to get started</p>
                    </div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table mobile-card-table">
                            <thead>
                                <tr>
                                    <th>Bus Name</th>
                                    <th>Bus Number</th>
                                    <th>Type</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Departure</th>
                                    <th>Arrival</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buses.map(bus => (
                                    <tr key={bus.id}>
                                        <td data-label="Bus Name"><strong>{bus.busName}</strong></td>
                                        <td data-label="Bus Number">{bus.busNumber}</td>
                                        <td data-label="Type">
                                            <span className={`status-badge ${bus.busType === 'AC' ? 'confirmed' : 'pending'}`}>
                                                {bus.busType}
                                            </span>
                                        </td>
                                        <td data-label="From">{bus.fromCity}</td>
                                        <td data-label="To">{bus.toCity}</td>
                                        <td data-label="Departure">{bus.departureTime}</td>
                                        <td data-label="Arrival">{bus.arrivalTime}</td>
                                        <td data-label="Actions">
                                            <button className="action-btn view" onClick={() => setEditBus(bus)}>
                                                Edit
                                            </button>
                                            <button className="action-btn reject" onClick={() => deleteBus(bus.id)}>
                                                Delete
                                            </button>
                                            <button className="action-btn approve" onClick={() => navigate(`/admin/seats/${bus.id}`)}>
                                                Seats
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            {editBus && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Edit Bus - {editBus.busName}</h3>
                        <button className="action-btn reject" onClick={() => setEditBus(null)}>Cancel</button>
                    </div>
                    <form onSubmit={updateBus} className="admin-form">
                        <div className="form-group">
                            <label>Bus Name</label>
                            <input
                                type="text"
                                value={editBus.busName}
                                onChange={(e) => setEditBus({ ...editBus, busName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bus Number</label>
                            <input
                                type="text"
                                value={editBus.busNumber}
                                onChange={(e) => setEditBus({ ...editBus, busNumber: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>From City</label>
                            <input
                                type="text"
                                value={editBus.fromCity}
                                onChange={(e) => setEditBus({ ...editBus, fromCity: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>To City</label>
                            <input
                                type="text"
                                value={editBus.toCity}
                                onChange={(e) => setEditBus({ ...editBus, toCity: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Departure Time</label>
                            <input
                                type="time"
                                value={editBus.departureTime}
                                onChange={(e) => setEditBus({ ...editBus, departureTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Arrival Time</label>
                            <input
                                type="time"
                                value={editBus.arrivalTime}
                                onChange={(e) => setEditBus({ ...editBus, arrivalTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Travel Date</label>
                            <input
                                type="date"
                                value={editBus.travelDate}
                                onChange={(e) => setEditBus({ ...editBus, travelDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bus Type</label>
                            <select
                                value={editBus.busType}
                                onChange={(e) => setEditBus({ ...editBus, busType: e.target.value })}
                            >
                                <option value="AC">AC</option>
                                <option value="NON_AC">NON AC</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Seater Price</label>
                            <input
                                type="number"
                                value={editBus.seaterPrice}
                                onChange={(e) => setEditBus({ ...editBus, seaterPrice: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Sleeper Price</label>
                            <input
                                type="number"
                                value={editBus.sleeperPrice}
                                onChange={(e) => setEditBus({ ...editBus, sleeperPrice: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="submit-btn">Update Bus</button>
                    </form>
                </div>
                )}
                </div>
                </div>
            </div>
        </div>
    )
}

export default ManageBuses

