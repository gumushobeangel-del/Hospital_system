import { Icon } from "../components/Icons";
import { Patient } from "../types";

interface QueuePageProps {
  patients: Patient[];
  onOpenRegister: () => void;
  onSelectPatient: (patient: Patient) => void;
  onUpdateStatus: (patientId: string, status: Patient["status"]) => void;
  searchQuery?: string;
}

export function QueuePage({
  patients,
  onOpenRegister,
  onSelectPatient,
  onUpdateStatus,
}: QueuePageProps) {
  const waitingList = patients.filter((p) => p.status === "In Queue");
  const inConsult = patients.filter((p) => p.status === "In Consultation");
  const urgentCount = waitingList.filter(
    (p) => p.priority === "Emergency" || p.priority === "Urgent"
  ).length;

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="activity" size={13} />
            <span>TRIAGE COMMAND & PATIENT QUEUE</span>
          </div>
          <h1>Live Patient Triage & Queue Monitor</h1>
          <p className="page-subtitle">
            Manage real-time outpatient waiting queues, call patients to consultation rooms, and assess priority.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenRegister}>
          <Icon name="plus" size={16} /> Admit Walk-in Patient
        </button>
      </div>

      {/* Queue Stats Banner */}
      <div className="queue-stats-bar">
        <div className="queue-stat-card">
          <span className="stat-label">TOTAL WAITING</span>
          <span className="stat-value" style={{ color: "var(--brand-600)" }}>
            {waitingList.length}
          </span>
          <span className="stat-sub">Patients awaiting consult</span>
        </div>
        <div className="queue-stat-card">
          <span className="stat-label">HIGH PRIORITY</span>
          <span className="stat-value" style={{ color: "var(--rose-600)" }}>
            {urgentCount}
          </span>
          <span className="stat-sub">Immediate triage needed</span>
        </div>
        <div className="queue-stat-card">
          <span className="stat-label">IN CONSULTATION</span>
          <span className="stat-value" style={{ color: "var(--indigo-600)" }}>
            {inConsult.length}
          </span>
          <span className="stat-sub">Active clinician rooms</span>
        </div>
        <div className="queue-stat-card">
          <span className="stat-label">AVERAGE WAIT TIME</span>
          <span className="stat-value" style={{ color: "var(--amber-600)" }}>
            14m
          </span>
          <span className="stat-sub">Within 20m benchmark</span>
        </div>
      </div>

      {/* Queue Cards Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Patients Waiting for Consultation</h2>
            <p>Ordered by arrival time and clinical triage priority</p>
          </div>
          <span className="badge badge-amber">{waitingList.length} In Line</span>
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {waitingList.map((pt, idx) => (
            <div key={pt.id} className="queue-patient-card">
              {/* Card Header */}
              <div className="queue-card-header">
                <div className="queue-position-badge">#{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="queue-card-name">{pt.name}</div>
                  <div className="queue-card-id">
                    <span className="badge-id">{pt.id}</span>
                  </div>
                </div>
                <span className={`priority-pill priority-${pt.priority.toLowerCase()}`}>
                  {pt.priority}
                </span>
              </div>

              {/* Card Body */}
              <div className="queue-card-body">
                <div className="queue-meta-row">
                  <div className="queue-meta-item">
                    <span className="meta-label">Department</span>
                    <span className="meta-value">{pt.department}</span>
                  </div>
                  <div className="queue-meta-item">
                    <span className="meta-label">Attending</span>
                    <span className="meta-value">{pt.attendingDoctor}</span>
                  </div>
                  <div className="queue-meta-item">
                    <span className="meta-label">Check-in</span>
                    <span className="meta-value">{pt.time}</span>
                  </div>
                  <div className="queue-meta-item">
                    <span className="meta-label">Age / Gender</span>
                    <span className="meta-value">
                      {pt.age} yrs · {pt.gender}
                    </span>
                  </div>
                </div>

                {pt.diagnosis && (
                  <div className="queue-complaint-text">
                    {pt.diagnosis}
                  </div>
                )}

                {pt.vitals && (
                  <div className="queue-vitals-row">
                    <div className="vital-item">
                      <span className="vital-label">BP</span>
                      <span className="vital-value">{pt.vitals.bp}</span>
                    </div>
                    <div className="vital-item">
                      <span className="vital-label">HR</span>
                      <span className="vital-value">{pt.vitals.heartRate}</span>
                    </div>
                    <div className="vital-item">
                      <span className="vital-label">Temp</span>
                      <span className="vital-value">{pt.vitals.temp}</span>
                    </div>
                    <div className="vital-item">
                      <span className="vital-label">SpO₂</span>
                      <span className="vital-value">{pt.vitals.spO2}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="queue-card-footer" style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => onSelectPatient(pt)}
                >
                  <Icon name="document" size={13} /> View File
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  style={{ marginLeft: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(pt.id, "In Consultation");
                  }}
                >
                  <Icon name="stethoscope" size={14} /> Call into Consult
                </button>
              </div>
            </div>
          ))}

          {waitingList.length === 0 && (
            <div className="empty-state-card">
              <div className="empty-icon">
                <Icon name="activity" size={26} />
              </div>
              <h3>Queue is currently clear</h3>
              <p>All registered patients have been seen or are in consultation rooms.</p>
              <button className="btn btn-secondary mt-2" onClick={onOpenRegister}>
                <Icon name="plus" size={15} /> Admit Walk-in Patient
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
