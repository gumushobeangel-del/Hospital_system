import { Icon } from "../components/Icons";
import {
  Patient,
  Appointment,
  Prescription,
  LabReport,
  ClinicalTask,
  UserAccount,
} from "../types";

interface OverviewPageProps {
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  tasks: ClinicalTask[];
  onNavigate: (page: string) => void;
  onOpenRegister: () => void;
  onOpenAppointment: () => void;
  onSelectPatient: (patient: Patient) => void;
  currentUser: UserAccount | null;
}

export function OverviewPage({
  patients,
  appointments,
  prescriptions,
  labReports,
  tasks,
  onNavigate,
  onOpenRegister,
  onOpenAppointment,
  onSelectPatient,
  currentUser,
}: OverviewPageProps) {
  const waitingPatients = patients.filter((p) => p.status === "In Queue");
  const inConsultPatients = patients.filter((p) => p.status === "In Consultation");
  const admittedPatients = patients.filter((p) => p.status === "Admitted" || p.status === "Observation");
  const dischargedPatients = patients.filter((p) => p.status === "Discharged");

  const pendingLabs = labReports.filter((l) => l.resultStatus === "Pending" || l.resultStatus === "Abnormal");
  const urgentQueue = patients.filter((p) => p.priority === "Emergency" || p.priority === "Urgent");

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="eyebrow-badge">
            <Icon name="hospital" size={13} />
            <span>HOSPITAL OPERATIONS COMMAND CENTER</span>
          </div>
          <h1>
            {currentUser?.name
              ? `Welcome back, ${currentUser.name}`
              : "MediLink Health Workspace"}
          </h1>
          <p className="welcome-sub">
            Real-time facility throughput, triage queue, active appointments, and clinical diagnostic telemetry.
          </p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-secondary" onClick={onOpenAppointment}>
            <Icon name="calendar" size={15} /> Book Consultation
          </button>
          <button className="btn btn-primary" onClick={onOpenRegister}>
            <Icon name="plus" size={15} /> Register Patient
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <section className="kpi-grid" aria-label="Key facility indicators">
        <div className="kpi-card" onClick={() => onNavigate("Patients")}>
          <div className="kpi-header">
            <span className="kpi-label">TOTAL PATIENTS</span>
            <div className="kpi-icon-wrap teal">
              <Icon name="patient" size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <span className="kpi-value">{patients.length}</span>
            <span className="kpi-trend positive">+14% this week</span>
          </div>
          <span className="kpi-subtext">Active clinical records in workspace</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate("Queue")}>
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE TRIAGE QUEUE</span>
            <div className="kpi-icon-wrap amber">
              <Icon name="activity" size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <span className="kpi-value">{waitingPatients.length}</span>
            <span className="kpi-badge amber">{urgentQueue.length} Urgent</span>
          </div>
          <span className="kpi-subtext">Avg waiting time: ~14 mins</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate("Appointments")}>
          <div className="kpi-header">
            <span className="kpi-label">TODAY'S SCHEDULE</span>
            <div className="kpi-icon-wrap indigo">
              <Icon name="calendar" size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <span className="kpi-value">{appointments.length}</span>
            <span className="kpi-trend neutral">6 rooms active</span>
          </div>
          <span className="kpi-subtext">Next: Dr. Sarah Chen (09:30)</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate("Lab reports")}>
          <div className="kpi-header">
            <span className="kpi-label">DIAGNOSTIC LABS</span>
            <div className="kpi-icon-wrap rose">
              <Icon name="lab" size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <span className="kpi-value">{labReports.length}</span>
            <span className="kpi-badge rose">{pendingLabs.length} Requiring Review</span>
          </div>
          <span className="kpi-subtext">Pathology, Hematology & Biochem</span>
        </div>

        <div className="kpi-card" onClick={() => onNavigate("Prescriptions")}>
          <div className="kpi-header">
            <span className="kpi-label">PHARMACY ORDERS</span>
            <div className="kpi-icon-wrap emerald">
              <Icon name="prescription" size={18} />
            </div>
          </div>
          <div className="kpi-main">
            <span className="kpi-value">{prescriptions.length}</span>
            <span className="kpi-trend positive">100% verified</span>
          </div>
          <span className="kpi-subtext">Electronic dispensary tracking</span>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Live Queue & Appointments */}
        <div className="dashboard-main-col">
          {/* Live Queue Monitor Panel */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Live Triage & Queue Monitor</h2>
                <p>Real-time patient flow and waiting list priority</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-teal">{waitingPatients.length} Waiting</span>
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => onNavigate("Queue")}
                >
                  View Full Queue
                </button>
              </div>
            </div>

            <div className="queue-overview-box">
              <div className="queue-meter-wrap">
                <div className="queue-donut">
                  <div className="donut-center">
                    <strong>{patients.length}</strong>
                    <span>Total Flow</span>
                  </div>
                </div>
                <div className="queue-legend-grid">
                  <div className="legend-item">
                    <span className="dot dot-waiting" />
                    <span className="label">In Queue / Waiting</span>
                    <strong>{waitingPatients.length}</strong>
                  </div>
                  <div className="legend-item">
                    <span className="dot dot-consult" />
                    <span className="label">In Consultation</span>
                    <strong>{inConsultPatients.length}</strong>
                  </div>
                  <div className="legend-item">
                    <span className="dot dot-admit" />
                    <span className="label">Admitted / Ward</span>
                    <strong>{admittedPatients.length}</strong>
                  </div>
                  <div className="legend-item">
                    <span className="dot dot-discharged" />
                    <span className="label">Discharged</span>
                    <strong>{dischargedPatients.length}</strong>
                  </div>
                </div>
              </div>

              {/* Waiting list snippet */}
              <div className="queue-list-snippet">
                <span className="table-caption-sub">NEXT PATIENTS IN LINE</span>
                {waitingPatients.slice(0, 3).map((pt, idx) => (
                  <div
                    key={pt.id}
                    className="queue-card-mini"
                    onClick={() => onSelectPatient(pt)}
                  >
                    <div className="queue-rank">#{idx + 1}</div>
                    <div className="queue-info">
                      <strong>{pt.name}</strong>
                      <small>
                        {pt.id} · {pt.department} · Arr: {pt.time}
                      </small>
                    </div>
                    <span className={`priority-pill priority-${pt.priority.toLowerCase()}`}>
                      {pt.priority}
                    </span>
                  </div>
                ))}
                {waitingPatients.length === 0 && (
                  <div className="empty-hint">Queue is currently clear.</div>
                )}
              </div>
            </div>
          </div>

          {/* Today's Appointments Timeline */}
          <div className="panel mt-4">
            <div className="panel-header">
              <div>
                <h2>Today's Clinical Consultations</h2>
                <p>Scheduled outpatient and specialist clinic sessions</p>
              </div>
              <button
                className="btn btn-xs btn-outline"
                onClick={() => onNavigate("Appointments")}
              >
                Schedule View
              </button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>TIME</th>
                    <th>PATIENT</th>
                    <th>PHYSICIAN</th>
                    <th>DEPARTMENT / ROOM</th>
                    <th>TYPE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.id}>
                      <td className="font-semibold text-teal">{apt.time}</td>
                      <td>
                        <strong>{apt.patientName}</strong>
                        <small className="block text-muted">{apt.patientId}</small>
                      </td>
                      <td>{apt.doctorName}</td>
                      <td>
                        <span>{apt.department}</span>
                        <small className="block text-muted">{apt.room}</small>
                      </td>
                      <td>
                        <span className="badge badge-slate">{apt.type}</span>
                      </td>
                      <td>
                        <span className={`status-pill status-${apt.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          <span className="status-dot" />
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions, Facility Capacity, & Tasks */}
        <div className="dashboard-side-col">
          {/* Facility Status & Bed Capacity */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Facility Capacity</h2>
                <p>Live bed occupancy & ward allocation</p>
              </div>
              <span className="badge badge-teal">78% Capacity</span>
            </div>

            <div className="capacity-card-body">
              <div className="capacity-bar-wrap">
                <div className="flex justify-between text-xs mb-1">
                  <span>Bed Utilization</span>
                  <strong>94 / 120 Beds Occupied</strong>
                </div>
                <div className="capacity-progress">
                  <div className="progress-fill" style={{ width: "78%" }} />
                </div>
              </div>

              <div className="ward-stats-list">
                <div className="ward-stat-row">
                  <span>Intensive Care Unit (ICU)</span>
                  <strong>10 / 12 (83%)</strong>
                </div>
                <div className="ward-stat-row">
                  <span>General Medical Ward</span>
                  <strong>48 / 60 (80%)</strong>
                </div>
                <div className="ward-stat-row">
                  <span>Pediatrics Wing</span>
                  <strong>16 / 24 (66%)</strong>
                </div>
                <div className="ward-stat-row">
                  <span>Maternity & Neonatal</span>
                  <strong>20 / 24 (83%)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="panel mt-4">
            <div className="panel-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Direct workspace shortcuts</p>
              </div>
            </div>

            <div className="quick-actions-grid">
              <button
                className="quick-action-card"
                onClick={onOpenRegister}
              >
                <div className="qa-icon teal">
                  <Icon name="patient" size={18} />
                </div>
                <span>Admit Patient</span>
              </button>

              <button
                className="quick-action-card"
                onClick={onOpenAppointment}
              >
                <div className="qa-icon indigo">
                  <Icon name="calendar" size={18} />
                </div>
                <span>New Booking</span>
              </button>

              <button
                className="quick-action-card"
                onClick={() => onNavigate("Prescriptions")}
              >
                <div className="qa-icon emerald">
                  <Icon name="prescription" size={18} />
                </div>
                <span>Dispense Rx</span>
              </button>

              <button
                className="quick-action-card"
                onClick={() => onNavigate("Lab reports")}
              >
                <div className="qa-icon rose">
                  <Icon name="lab" size={18} />
                </div>
                <span>Order Labs</span>
              </button>

              <button
                className="quick-action-card"
                onClick={() => onNavigate("Inventory")}
              >
                <div className="qa-icon amber">
                  <Icon name="inventory" size={18} />
                </div>
                <span>Check Stock</span>
              </button>

              <button
                className="quick-action-card"
                onClick={() => onNavigate("Staff")}
              >
                <div className="qa-icon slate">
                  <Icon name="users" size={18} />
                </div>
                <span>Staff & RBAC</span>
              </button>
            </div>
          </div>

          {/* Clinical Tasks */}
          <div className="panel mt-4">
            <div className="panel-header">
              <div>
                <h2>Active Clinical Tasks</h2>
                <p>Priority actions for attending care team</p>
              </div>
              <span className="badge badge-amber">{tasks.length} Active</span>
            </div>

            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-check">
                    <Icon
                      name={task.completed ? "check" : "tasks"}
                      size={15}
                      className={task.completed ? "text-teal" : "text-muted"}
                    />
                  </div>
                  <div className="task-text">
                    <span className={task.completed ? "line-through text-muted" : "font-medium"}>
                      {task.title}
                    </span>
                    <small className="block text-muted">
                      {task.department} · {task.assignee} · Due {task.dueTime}
                    </small>
                  </div>
                  <span className={`priority-pill priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
