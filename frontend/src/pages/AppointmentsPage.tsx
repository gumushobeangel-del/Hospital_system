import { useState } from "react";
import { Icon } from "../components/Icons";
import { Appointment } from "../types";

interface AppointmentsPageProps {
  appointments: Appointment[];
  onOpenBookAppointment: () => void;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
  searchQuery: string;
}

export function AppointmentsPage({
  appointments,
  onOpenBookAppointment,
  onUpdateStatus,
  searchQuery,
}: AppointmentsPageProps) {
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = appointments.filter((apt) => {
    const matchSearch =
      searchQuery === "" ||
      `${apt.patientName} ${apt.doctorName} ${apt.department} ${apt.room} ${apt.type}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="calendar" size={13} />
            <span>CLINIC CALENDAR & CONSULTATIONS</span>
          </div>
          <h1>Appointments & Clinic Schedule</h1>
          <p className="page-subtitle">
            Manage outpatient booking slots, specialist consults, and procedural follow-ups.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenBookAppointment}>
          <Icon name="plus" size={16} /> Schedule Appointment
        </button>
      </div>

      {/* Filter Chips */}
      <div className="filter-controls-card">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted">STATUS:</span>
          {["All", "Confirmed", "Waiting", "In Progress", "Completed", "Canceled"].map((st) => (
            <button
              key={st}
              className={`pill-btn ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Scheduled Consultations</h2>
            <p>Showing {filtered.length} scheduled visits</p>
          </div>
          <span className="badge badge-teal">{filtered.length} Sessions</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>APPOINTMENT ID</th>
                <th>TIME SLOT</th>
                <th>PATIENT</th>
                <th>CLINICIAN</th>
                <th>DEPARTMENT</th>
                <th>LOCATION</th>
                <th>TYPE</th>
                <th>STATUS</th>
                <th>UPDATE STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id}>
                  <td className="font-mono text-xs font-semibold text-muted">{apt.id}</td>
                  <td>
                    <strong className="text-teal">{apt.time}</strong>
                    <small className="block text-muted">{apt.date}</small>
                  </td>
                  <td>
                    <strong>{apt.patientName}</strong>
                    <small className="block text-muted">{apt.patientId}</small>
                  </td>
                  <td>{apt.doctorName}</td>
                  <td>{apt.department}</td>
                  <td>
                    <span className="badge badge-slate">{apt.room}</span>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{apt.type}</span>
                  </td>
                  <td>
                    <span className={`status-pill status-${apt.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      <span className="status-dot" />
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {apt.status === "Confirmed" && (
                        <button
                          className="btn btn-xs btn-outline-teal"
                          onClick={() => onUpdateStatus(apt.id, "Waiting")}
                        >
                          Check In
                        </button>
                      )}
                      {apt.status === "Waiting" && (
                        <button
                          className="btn btn-xs btn-outline-teal"
                          onClick={() => onUpdateStatus(apt.id, "In Progress")}
                        >
                          Begin Consult
                        </button>
                      )}
                      {apt.status === "In Progress" && (
                        <button
                          className="btn btn-xs btn-outline-secondary"
                          onClick={() => onUpdateStatus(apt.id, "Completed")}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="empty-table-state">
                    <Icon name="calendar" size={24} />
                    <p>No appointments match the selected filter criteria.</p>
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
