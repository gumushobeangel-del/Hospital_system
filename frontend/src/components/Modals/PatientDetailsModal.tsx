import { Icon } from "../Icons";
import { Patient } from "../../types";

interface PatientDetailsModalProps {
  patient: Patient | null;
  onClose: () => void;
  onUpdateStatus: (patientId: string, newStatus: Patient["status"]) => void;
}

export function PatientDetailsModal({
  patient,
  onClose,
  onUpdateStatus,
}: PatientDetailsModalProps) {
  if (!patient) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-container modal-md" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="patient-avatar-lg">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2>{patient.name}</h2>
                <span className="badge badge-id">{patient.id}</span>
              </div>
              <p>
                {patient.gender} · {patient.age} years · Blood: <strong>{patient.bloodGroup}</strong>
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="patient-detail-body">
          {/* Status and Department Bar */}
          <div className="detail-meta-banner">
            <div>
              <span className="meta-label">CURRENT STATUS</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`status-pill status-${patient.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  <span className="status-dot" />
                  {patient.status}
                </span>
                <span className={`priority-pill priority-${patient.priority.toLowerCase()}`}>
                  {patient.priority}
                </span>
              </div>
            </div>
            <div>
              <span className="meta-label">DEPARTMENT</span>
              <p className="meta-value">{patient.department}</p>
            </div>
            <div>
              <span className="meta-label">ATTENDING CLINICIAN</span>
              <p className="meta-value">{patient.attendingDoctor}</p>
            </div>
          </div>

          {/* Vitals Signs Card */}
          <div className="vitals-panel">
            <div className="panel-subhead">
              <Icon name="activity" size={15} />
              <span>Current Vitals</span>
              <small className="ml-auto text-muted">Recorded {patient.time}</small>
            </div>
            <div className="vitals-grid">
              <div className="vital-item">
                <span className="vital-label">Blood Pressure</span>
                <strong className="vital-val">{patient.vitals?.bp ?? "120/80"}</strong>
                <span className="vital-unit">mmHg</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Heart Rate</span>
                <strong className="vital-val">{patient.vitals?.heartRate ?? 72}</strong>
                <span className="vital-unit">BPM</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Temperature</span>
                <strong className="vital-val">{patient.vitals?.temp ?? "36.8°C"}</strong>
                <span className="vital-unit">Oral</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">SpO2 Oxygen</span>
                <strong className="vital-val">{patient.vitals?.spO2 ?? 99}%</strong>
                <span className="vital-unit">Room Air</span>
              </div>
            </div>
          </div>

          {/* Allergies & Clinical Assessment */}
          <div className="clinical-notes-card">
            <div className="panel-subhead text-danger">
              <Icon name="alertCircle" size={15} />
              <span>Known Allergies & Contraindications</span>
            </div>
            <div className="allergy-tags">
              {patient.allergies.map((allergy) => (
                <span key={allergy} className="allergy-tag">
                  {allergy}
                </span>
              ))}
            </div>

            <div className="panel-subhead mt-4">
              <Icon name="document" size={15} />
              <span>Diagnosis / Admitting Notes</span>
            </div>
            <p className="clinical-text">
              {patient.diagnosis || "No primary diagnosis recorded at intake."}
            </p>
          </div>

          {/* Quick status change actions */}
          <div className="action-buttons-group">
            <span className="meta-label mb-2 block">QUICK WORKFLOW ACTION</span>
            <div className="flex gap-2 flex-wrap">
              {patient.status !== "In Consultation" && (
                <button
                  className="btn btn-sm btn-outline-teal"
                  onClick={() => onUpdateStatus(patient.id, "In Consultation")}
                >
                  <Icon name="stethoscope" size={14} /> Call into Consultation
                </button>
              )}
              {patient.status !== "Admitted" && (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onUpdateStatus(patient.id, "Admitted")}
                >
                  <Icon name="hospital" size={14} /> Admit to Ward
                </button>
              )}
              {patient.status !== "Discharged" && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => onUpdateStatus(patient.id, "Discharged")}
                >
                  <Icon name="check" size={14} /> Mark Discharged
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
