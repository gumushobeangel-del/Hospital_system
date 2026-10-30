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
  const urgentCount = waitingList.filter((p) => p.priority === "Emergency" || p.priority === "Urgent").length;

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
      <div className="queue-metric-banner">
        <div className="queue-stat-card">
          <span className="stat-label">TOTAL IN WAITING ROOM</span>
          <strong className="stat-number text-teal">{waitingList.length}</strong>
          <span className="stat-note">Patients awaiting consult</span>
        </div>
        <div className="queue-stat-card">
          <span className="stat-label">HIGH PRIORITY / EMERGENCY</span>
          <strong className="stat-number text-rose">{urgentCount}</strong>
          <span className="stat-note">Immediate triage needed</span>
        </div>
        <div className="queue-stat-card">
          <span className="stat-label">CURRENTLY IN CONSULTATION</span>
          <strong className="stat-number text-indigo">{inConsult.length}</strong>
          <span className="stat-note">Active clinician rooms</span>
        </div>
        <div className="queue-stat-card">
          <span className="stat-label">AVERAGE WAIT TIME</span>
          <strong className="stat-number text-amber">14m</strong>
          <span className="stat-note">Within 20m benchmark target</span>
        </div>
      </div>

      {/* Queue Cards Grid */}
      <div className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Patients Waiting for Consultation</h2>
            <p>Ordered by arrival time and clinical triage priority</p>
          </div>
          <span className="badge badge-amber">{waitingList.length} In Line</span>
        </div>

        <div className="queue-cards-container">
          {waitingList.map((pt, idx) => (
            <div
              key={pt.id}
              className="queue-card-full"
              onClick={() => onSelectPatient(pt)}
            >
              <div className="queue-index">
                <span>QUEUE</span>
                <strong>#{idx + 1}</strong>
              </div>

              <div className="queue-main-info">
                <div className="flex items-center gap-2">
                  <h3 className="queue-patient-title">{pt.name}</h3>
                  <span className="badge badge-id">{pt.id}</span>
                  <span className={`priority-pill priority-${pt.priority.toLowerCase()}`}>
                    {pt.priority}
                  </span>
                </div>
                <p className="queue-meta-text">
                  {pt.department} · Attending: <strong>{pt.attendingDoctor}</strong> · Checked in at: <strong>{pt.time}</strong>
                </p>
                <p className="queue-complaint">
                  Complaint: {pt.diagnosis || "Triage assessment pending"}
                </p>
              </div>

              <div className="queue-vitals-box">
                {pt.vitals && (
                  <div className="vitals-micro">
                    <span>BP: <strong>{pt.vitals.bp}</strong></span>
                    <span>HR: <strong>{pt.vitals.heartRate}</strong></span>
                    <span>Temp: <strong>{pt.vitals.temp}</strong></span>
                  </div>
                )}
              </div>

              <div className="queue-card-action">
                <button
                  className="btn btn-sm btn-primary"
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
            <div className="empty-table-state">
              <Icon name="activity" size={32} />
              <h3>The queue is currently clear</h3>
              <p>All registered patients have been seen or are in consultation rooms.</p>
              <button className="btn btn-secondary mt-2" onClick={onOpenRegister}>
                Admit Walk-in Patient
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
