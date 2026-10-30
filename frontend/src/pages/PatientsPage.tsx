import { useState, useMemo } from "react";
import { Icon } from "../components/Icons";
import { Patient } from "../types";
import { departmentsList } from "../data/seedData";

interface PatientsPageProps {
  patients: Patient[];
  onOpenRegister: () => void;
  onSelectPatient: (patient: Patient) => void;
  searchQuery: string;
}

export function PatientsPage({
  patients,
  onOpenRegister,
  onSelectPatient,
  searchQuery,
}: PatientsPageProps) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredPatients = useMemo(() => {
    return patients.filter((pt) => {
      const matchSearch =
        searchQuery === "" ||
        `${pt.name} ${pt.id} ${pt.department} ${pt.attendingDoctor} ${pt.diagnosis || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchDept = selectedDept === "All" || pt.department === selectedDept;
      const matchPriority = selectedPriority === "All" || pt.priority === selectedPriority;
      const matchStatus = selectedStatus === "All" || pt.status === selectedStatus;

      return matchSearch && matchDept && matchPriority && matchStatus;
    });
  }, [patients, searchQuery, selectedDept, selectedPriority, selectedStatus]);

  return (
    <div className="page-content">
      {/* Header bar */}
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="patient" size={13} />
            <span>CLINICAL INTAKE & REGISTRY</span>
          </div>
          <h1>Patients Registry</h1>
          <p className="page-subtitle">
            Comprehensive patient demographic, triage status, vital signs, and clinical tracking.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenRegister}>
          <Icon name="plus" size={16} /> Register New Patient
        </button>
      </div>

      {/* Filter and Tab Bar */}
      <div className="filter-controls-card">
        <div className="dept-tabs-scroll">
          <button
            className={`tab-chip ${selectedDept === "All" ? "active" : ""}`}
            onClick={() => setSelectedDept("All")}
          >
            All Departments ({patients.length})
          </button>
          {departmentsList.map((dep) => {
            const count = patients.filter((p) => p.department === dep).length;
            return (
              <button
                key={dep}
                className={`tab-chip ${selectedDept === dep ? "active" : ""}`}
                onClick={() => setSelectedDept(dep)}
              >
                {dep} {count > 0 && <span className="tab-count">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="subfilter-row">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">PRIORITY:</span>
            {["All", "Routine", "Urgent", "Emergency"].map((p) => (
              <button
                key={p}
                className={`pill-btn ${selectedPriority === p ? "active" : ""}`}
                onClick={() => setSelectedPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-muted">STATUS:</span>
            {["All", "In Queue", "In Consultation", "Admitted", "Observation", "Discharged"].map((s) => (
              <button
                key={s}
                className={`pill-btn ${selectedStatus === s ? "active" : ""}`}
                onClick={() => setSelectedStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Clinical Patient Records</h2>
            <p>Showing {filteredPatients.length} of {patients.length} registered patients</p>
          </div>
          <span className="badge badge-teal">{filteredPatients.length} Records</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>PATIENT NAME & ID</th>
                <th>DEMOGRAPHICS</th>
                <th>DEPARTMENT</th>
                <th>ATTENDING CLINICIAN</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>LATEST VITALS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((pt) => (
                <tr
                  key={pt.id}
                  className="table-row-clickable"
                  onClick={() => onSelectPatient(pt)}
                >
                  <td>
                    <div className="patient-name-cell">
                      <div className="patient-avatar-sm">
                        {pt.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{pt.name}</strong>
                        <span className="patient-id-tag">{pt.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>
                      {pt.age} yrs · {pt.gender}
                    </span>
                    <small className="block text-muted">Blood: {pt.bloodGroup}</small>
                  </td>
                  <td>
                    <strong>{pt.department}</strong>
                    {pt.roomNumber && (
                      <small className="block text-muted">{pt.roomNumber}</small>
                    )}
                  </td>
                  <td>{pt.attendingDoctor}</td>
                  <td>
                    <span className={`priority-pill priority-${pt.priority.toLowerCase()}`}>
                      {pt.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill status-${pt.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      <span className="status-dot" />
                      {pt.status}
                    </span>
                  </td>
                  <td>
                    {pt.vitals ? (
                      <div className="vitals-micro">
                        <span>BP: <strong>{pt.vitals.bp}</strong></span>
                        <span>HR: <strong>{pt.vitals.heartRate}</strong></span>
                        <span>SpO2: <strong>{pt.vitals.spO2}%</strong></span>
                      </div>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-outline-teal"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(pt);
                      }}
                    >
                      <Icon name="document" size={13} /> View File
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-table-state">
                    <Icon name="search" size={24} />
                    <p>No matching patient records found.</p>
                    <button className="btn btn-sm btn-secondary mt-2" onClick={onOpenRegister}>
                      Admit New Patient
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
