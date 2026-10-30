import { Icon } from "../components/Icons";

export function AnalyticsPage() {
  const departments = [
    { name: "General Medicine", count: 28, percent: 35, color: "bg-teal" },
    { name: "Paediatrics", count: 18, percent: 22, color: "bg-indigo" },
    { name: "Cardiology", count: 14, percent: 17, color: "bg-rose" },
    { name: "Orthopaedics", count: 10, percent: 13, color: "bg-amber" },
    { name: "Maternity", count: 8, percent: 10, color: "bg-emerald" },
    { name: "Dental", count: 3, percent: 3, color: "bg-slate" },
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

      {/* Top benchmark cards */}
      <div className="analytics-metrics-grid">
        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">PATIENT SATISFACTION</span>
            <span className="text-teal font-bold">4.8 / 5.0</span>
          </div>
          <strong className="stat-value">96.2%</strong>
          <span className="stat-note positive">Based on 340 outpatient survey responses</span>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">AVG CONSULTATION DURATION</span>
            <span className="text-indigo font-bold">Target 15m</span>
          </div>
          <strong className="stat-value">16.4 mins</strong>
          <span className="stat-note">Comprehensive clinical reviews</span>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">LAB TURNAROUND TIME</span>
            <span className="text-emerald font-bold">Stat Labs</span>
          </div>
          <strong className="stat-value">34 mins</strong>
          <span className="stat-note positive">-8 mins faster than quarterly goal</span>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">DISPENSARY ACCURACY</span>
            <span className="text-teal font-bold">Zero Defect</span>
          </div>
          <strong className="stat-value">100.0%</strong>
          <span className="stat-note">All e-prescriptions digitally cross-verified</span>
        </div>
      </div>

      {/* Analytics Content Grid */}
      <div className="dashboard-grid mt-4">
        {/* Department Workload Bar Chart */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Patient Distribution by Clinical Specialty</h2>
              <p>Weekly admissions and outpatient visits breakdown</p>
            </div>
            <span className="badge badge-teal">Current Week</span>
          </div>

          <div className="analytics-body">
            <div className="dept-bars-container">
              {departments.map((dept) => (
                <div key={dept.name} className="dept-bar-row">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{dept.name}</span>
                    <span className="text-muted">
                      {dept.count} patients ({dept.percent}%)
                    </span>
                  </div>
                  <div className="dept-progress-track">
                    <div
                      className={`dept-progress-fill ${dept.color}`}
                      style={{ width: `${dept.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Patient Flow Pattern */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Hourly Patient Intake Volume</h2>
              <p>Peak admission hours & triage congestion patterns</p>
            </div>
            <span className="badge badge-amber">Today's Curve</span>
          </div>

          <div className="analytics-body">
            <div className="hourly-flow-grid">
              {[
                { time: "08:00", volume: 14, height: "45%" },
                { time: "09:00", volume: 26, height: "85%" },
                { time: "10:00", volume: 31, height: "100%" },
                { time: "11:00", volume: 22, height: "70%" },
                { time: "12:00", volume: 15, height: "48%" },
                { time: "13:00", volume: 18, height: "58%" },
                { time: "14:00", volume: 24, height: "78%" },
                { time: "15:00", volume: 19, height: "62%" },
                { time: "16:00", volume: 12, height: "40%" },
              ].map((slot) => (
                <div key={slot.time} className="hour-bar-col">
                  <span className="hour-val">{slot.volume}</span>
                  <div className="hour-bar-wrap">
                    <div className="hour-bar-fill" style={{ height: slot.height }} />
                  </div>
                  <span className="hour-label">{slot.time}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted text-center mt-4">
              Peak outpatient intake observed between <strong>09:30 and 10:45 AM</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
