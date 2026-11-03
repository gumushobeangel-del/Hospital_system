import { Icon } from "../components/Icons";

export function AnalyticsPage() {
  const departments = [
    { name: "General Medicine", count: 28, percent: 35 },
    { name: "Paediatrics", count: 18, percent: 22 },
    { name: "Cardiology", count: 14, percent: 17 },
    { name: "Orthopaedics", count: 10, percent: 13 },
    { name: "Maternity", count: 8, percent: 10 },
    { name: "Dental", count: 3, percent: 3 },
  ];

  const hourlySlots = [
    { time: "08:00", volume: 14, height: "45%" },
    { time: "09:00", volume: 26, height: "85%" },
    { time: "10:00", volume: 31, height: "100%" },
    { time: "11:00", volume: 22, height: "70%" },
    { time: "12:00", volume: 15, height: "48%" },
    { time: "13:00", volume: 18, height: "58%" },
    { time: "14:00", volume: 24, height: "78%" },
    { time: "15:00", volume: 19, height: "62%" },
    { time: "16:00", volume: 12, height: "40%" },
  ];

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="chart" size={13} />
            <span>OPERATIONAL TELEMETRY & INSIGHTS</span>
          </div>
          <h1>Facility Analytics & Performance</h1>
          <p className="page-subtitle">
            Aggregate clinical throughput metrics, department workloads, and quality benchmarks.
          </p>
        </div>
      </div>

      {/* Benchmark Metric Cards */}
      <div className="analytics-metrics-grid">
        <div className="analytics-metric-card">
          <div className="analytics-metric-label">PATIENT SATISFACTION</div>
          <div className="analytics-metric-value">96.2%</div>
          <div className="analytics-metric-sub" style={{ color: "var(--emerald-600)", fontWeight: 600 }}>
            4.8 / 5.0 — Based on 340 surveys
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-label">AVG CONSULTATION DURATION</div>
          <div className="analytics-metric-value">16.4m</div>
          <div className="analytics-metric-sub">Target 15m — Comprehensive reviews</div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-label">LAB TURNAROUND TIME</div>
          <div className="analytics-metric-value">34m</div>
          <div className="analytics-metric-sub" style={{ color: "var(--emerald-600)", fontWeight: 600 }}>
            −8m faster than quarterly goal
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-label">DISPENSARY ACCURACY</div>
          <div className="analytics-metric-value">100%</div>
          <div className="analytics-metric-sub">All e-prescriptions digitally verified</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        {/* Department Bar Chart */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Patient Distribution by Specialty</h2>
              <p>Weekly admissions and outpatient visits breakdown</p>
            </div>
            <span className="badge badge-teal">Current Week</span>
          </div>

          <div className="dept-bars-container">
            {departments.map((dept) => (
              <div key={dept.name} className="dept-bar-row">
                <span className="dept-bar-label">{dept.name}</span>
                <div className="dept-bar-track">
                  <div
                    className="dept-progress-fill"
                    style={{ width: `${dept.percent}%` }}
                  />
                </div>
                <span className="dept-bar-value">
                  {dept.count} <span style={{ color: "var(--slate-400)", fontWeight: 400 }}>({dept.percent}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Flow Chart */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Hourly Patient Intake Volume</h2>
              <p>Peak admission hours & triage congestion patterns</p>
            </div>
            <span className="badge badge-amber">Today's Curve</span>
          </div>

          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "10px",
                height: "180px",
                marginBottom: "12px",
              }}
            >
              {hourlySlots.map((slot) => (
                <div
                  key={slot.time}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--slate-500)",
                      marginBottom: "auto",
                    }}
                  >
                    {slot.volume}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      height: slot.height,
                      background: "linear-gradient(180deg, var(--brand-400), var(--brand-700))",
                      borderRadius: "6px 6px 0 0",
                      boxShadow: "0 0 8px rgba(20,184,166,0.2)",
                      minHeight: "4px",
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {hourlySlots.map((slot) => (
                <div
                  key={slot.time}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: "9.5px",
                    color: "var(--slate-400)",
                    fontWeight: 600,
                  }}
                >
                  {slot.time}
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: "11.5px",
                color: "var(--slate-500)",
                textAlign: "center",
                marginTop: "16px",
                fontStyle: "italic",
              }}
            >
              Peak intake: <strong style={{ color: "var(--slate-700)" }}>09:30 – 10:45 AM</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
