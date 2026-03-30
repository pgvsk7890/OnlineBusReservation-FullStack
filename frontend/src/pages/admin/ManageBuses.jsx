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
    } catch {
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

    if (editBus.seaterPrice <= 0 || editBus.sleeperPrice <= 0) {
      alert("Price must be greater than 0")
      return
    }

    try {
      await api.put(`/bus/update/${editBus.id}`, editBus)
      alert("Bus updated successfully")
      setEditBus(null)
      fetchBuses()
    } catch {
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
          <div className="quick-actions">
            <button className="quick-action-btn secondary" onClick={() => navigate("/admin/add-bus")}>
              Add New Bus
            </button>
          </div>

          {buses.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="6" r="3" />
                <path d="M5 10h14l-1.5 9h-11z" />
              </svg>
              <h3>No Buses Found</h3>
              <p>Add some buses to get started</p>
            </div>
          ) : (
            <div className="admin-card admin-table-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Fleet Overview</h3>
              </div>

              <div className="admin-table-wrap admin-desktop-table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Bus</th>
                      <th>Number</th>
                      <th>Type</th>
                      <th>Route</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Seater</th>
                      <th>Sleeper</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.map((bus) => (
                      <tr key={bus.id}>
                        <td>
                          <div className="admin-bus-cell">
                            <strong>{bus.busName}</strong>
                            <span>Fleet bus</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-bus-cell admin-bus-meta">
                            <strong>{bus.busNumber}</strong>
                            <span>Bus number</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${bus.busType === "AC" ? "confirmed" : "pending"}`}>
                            {bus.busType}
                          </span>
                        </td>
                        <td>
                          <div className="admin-bus-cell admin-bus-route">
                            <strong>{bus.fromCity}</strong>
                            <span>to {bus.toCity}</span>
                          </div>
                        </td>
                        <td><span className="admin-time-chip">{bus.departureTime}</span></td>
                        <td><span className="admin-time-chip">{bus.arrivalTime}</span></td>
                        <td><span className="booking-card-amount">Rs.{bus.seaterPrice}</span></td>
                        <td><span className="booking-card-amount">Rs.{bus.sleeperPrice}</span></td>
                        <td>
                          <div className="table-actions table-actions-inline">
                            <button className="action-btn view" onClick={() => setEditBus(bus)} type="button">Edit</button>
                            <button className="action-btn reject" onClick={() => deleteBus(bus.id)} type="button">Delete</button>
                            <button className="action-btn approve" onClick={() => navigate(`/admin/seats/${bus.id}`)} type="button">Seats</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-mobile-bus-list">
                {buses.map((bus) => (
                  <div key={bus.id} className="admin-item-card admin-bus-mobile-card">
                    <div className="admin-item-card-header">
                      <div>
                        <div className="admin-item-card-title">{bus.busName}</div>
                        <span className="admin-item-card-id">{bus.busNumber}</span>
                      </div>
                      <span className={`status-badge ${bus.busType === "AC" ? "confirmed" : "pending"}`}>
                        {bus.busType}
                      </span>
                    </div>

                    <div className="admin-item-card-body">
                      <div className="admin-item-row">
                        <span className="admin-item-label">Route</span>
                        <span className="admin-item-value">{bus.fromCity} to {bus.toCity}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Departure</span>
                        <span className="admin-item-value">{bus.departureTime}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Arrival</span>
                        <span className="admin-item-value">{bus.arrivalTime}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Seater</span>
                        <span className="booking-card-amount">Rs.{bus.seaterPrice}</span>
                      </div>
                      <div className="admin-item-row">
                        <span className="admin-item-label">Sleeper</span>
                        <span className="booking-card-amount">Rs.{bus.sleeperPrice}</span>
                      </div>
                    </div>

                    <div className="admin-item-card-actions">
                      <button className="action-btn view" onClick={() => setEditBus(bus)} type="button">Edit</button>
                      <button className="action-btn reject" onClick={() => deleteBus(bus.id)} type="button">Delete</button>
                      <button className="action-btn approve" onClick={() => navigate(`/admin/seats/${bus.id}`)} type="button">Seats</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {editBus && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Edit Bus - {editBus.busName}</h3>
                <button className="action-btn reject" onClick={() => setEditBus(null)} type="button">Cancel</button>
              </div>
              <form onSubmit={updateBus} className="admin-form">
                <div className="form-group">
                  <label>Bus Name</label>
                  <input type="text" value={editBus.busName} onChange={(e) => setEditBus({ ...editBus, busName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Bus Number</label>
                  <input type="text" value={editBus.busNumber} onChange={(e) => setEditBus({ ...editBus, busNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>From City</label>
                  <input type="text" value={editBus.fromCity} onChange={(e) => setEditBus({ ...editBus, fromCity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>To City</label>
                  <input type="text" value={editBus.toCity} onChange={(e) => setEditBus({ ...editBus, toCity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Departure Time</label>
                  <input type="time" value={editBus.departureTime} onChange={(e) => setEditBus({ ...editBus, departureTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Arrival Time</label>
                  <input type="time" value={editBus.arrivalTime} onChange={(e) => setEditBus({ ...editBus, arrivalTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Bus Type</label>
                  <select value={editBus.busType} onChange={(e) => setEditBus({ ...editBus, busType: e.target.value })}>
                    <option value="AC">AC</option>
                    <option value="NON_AC">NON AC</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Seater Price</label>
                  <input 
                    type="number" 
                    min="1"
                    value={editBus.seaterPrice} 
                    onChange={(e) => setEditBus({ ...editBus, seaterPrice: Number(e.target.value) })} 
                  />
                </div>
                <div className="form-group">
                  <label>Sleeper Price</label>
                  <input 
                    type="number" 
                    min="1"
                    value={editBus.sleeperPrice} 
                    onChange={(e) => setEditBus({ ...editBus, sleeperPrice: Number(e.target.value) })} 
                  />
                </div>
                <button type="submit" className="submit-btn">Update Bus</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageBuses
