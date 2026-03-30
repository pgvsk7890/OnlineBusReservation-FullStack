import { useEffect, useState } from "react"
import api from "../../services/api"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function AdminDashboard() {
  const [stats, setStats] = useState({ buses: 0, bookings: 0, pending: 0, revenue: 0 })
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const busesRes = await api.get("/bus/all")
      const bookingsRes = await api.get("/booking/all")
      const bookings = bookingsRes.data

      const pendingPayments = bookings.filter((booking) => booking.paymentStatus === "PENDING")
      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)

      setStats({
        buses: busesRes.data.length,
        bookings: bookings.length,
        pending: pendingPayments.length,
        revenue: totalRevenue
      })

      prepareChart(bookings)
    } catch (err) {
      console.log("Dashboard error", err)
    } finally {
      setLoading(false)
    }
  }

  const prepareChart = (bookings) => {
    const bookingCount = {}
    const revenueData = {}

    bookings.forEach((booking) => {
      if (!booking.bookingTime) return
      const date = booking.bookingTime.split("T")[0]
      bookingCount[date] = (bookingCount[date] || 0) + 1
      revenueData[date] = (revenueData[date] || 0) + (booking.amount || 0)
    })

    setChartData({
      labels: Object.keys(bookingCount),
      datasets: [
        {
          label: "Bookings",
          data: Object.values(bookingCount),
          backgroundColor: "rgba(227, 30, 36, 0.8)",
          borderRadius: 8
        },
        {
          label: "Revenue (Rs)",
          data: Object.values(revenueData),
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderRadius: 8
        }
      ]
    })
  }

  if (loading) {
    return <div className="admin-page"><div className="loading-state"><div className="loading-spinner"></div></div></div>
  }

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <div className="admin-page-header-left">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's an overview of your bus booking system.</p>
          </div>
        </div>

        <div className="admin-page-content">
          <div className="stats-grid admin-dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="6" r="3" />
                  <path d="M5 10h14l-1.5 9h-11z" />
                </svg>
              </div>
              <div className="stat-label">Total Buses</div>
              <div className="stat-value">{stats.buses}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="stat-label">Total Bookings</div>
              <div className="stat-value">{stats.bookings}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-label">Pending Payments</div>
              <div className="stat-value">{stats.pending}</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">Rs.{stats.revenue.toLocaleString()}</div>
            </div>
          </div>

          <div className="chart-container admin-dashboard-chart">
            <h3 className="chart-title">Bookings & Revenue Overview</h3>
            <div className="admin-dashboard-chart-area">
              {chartData && (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
