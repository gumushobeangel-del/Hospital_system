import { useState } from "react";
import { Icon } from "../components/Icons";
import { Prescription } from "../types";

interface PrescriptionsPageProps {
  prescriptions: Prescription[];
  onUpdateStatus: (id: string, status: Prescription["status"]) => void;
  searchQuery: string;
}

export function PrescriptionsPage({
  prescriptions,
  onUpdateStatus,
  searchQuery,
}: PrescriptionsPageProps) {
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = prescriptions.filter((rx) => {
    const matchSearch =
      searchQuery === "" ||
      `${rx.rxNumber} ${rx.patientName} ${rx.doctorName} ${rx.medication}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === "All" || rx.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="prescription" size={13} />
            <span>ELECTRONIC DISPENSARY & PHARMACY</span>
          </div>
          <h1>Prescriptions & Medication Orders</h1>
          <p className="page-subtitle">
            Dispense verified pharmaceuticals, review dosing protocols, and monitor drug safety.
          </p>
        </div>
      </div>

      <div className="filter-controls-card">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted">DISPENSARY STATUS:</span>
          {["All", "Pending Review", "Ready for Pickup", "Dispensed"].map((st) => (
            <button
              key={st}
              className={`pill-btn ${filterStatus === st ? "active" : ""}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Active Medication Orders</h2>
            <p>Showing {filtered.length} dispensary entries</p>
          </div>
          <span className="badge badge-teal">{filtered.length} Prescriptions</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>RX NUMBER</th>
                <th>PATIENT</th>
                <th>PRESCRIBER</th>
                <th>MEDICATION & DOSAGE</th>
                <th>FREQUENCY & DURATION</th>
                <th>DATE ISSUED</th>
                <th>STATUS</th>
                <th>DISPENSARY ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rx) => (
                <tr key={rx.id}>
                  <td className="font-mono text-xs font-bold text-teal">{rx.rxNumber}</td>
                  <td>
                    <strong>{rx.patientName}</strong>
                    <small className="block text-muted">{rx.patientId}</small>
                  </td>
                  <td>{rx.doctorName}</td>
                  <td>
                    <strong className="text-navy">{rx.medication}</strong>
                    <small className="block text-muted">Dosage: {rx.dosage}</small>
                  </td>
                  <td>
                    <span>{rx.frequency}</span>
                    <small className="block text-muted">Course: {rx.duration}</small>
                  </td>
                  <td>{rx.date}</td>
                  <td>
                    <span className={`status-pill status-${rx.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      <span className="status-dot" />
                      {rx.status}
                    </span>
                  </td>
                  <td>
                    {rx.status === "Pending Review" && (
                      <button
                        className="btn btn-xs btn-outline-teal"
                        onClick={() => onUpdateStatus(rx.id, "Ready for Pickup")}
                      >
                        Approve Rx
                      </button>
                    )}
                    {rx.status === "Ready for Pickup" && (
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => onUpdateStatus(rx.id, "Dispensed")}
                      >
                        Dispense
                      </button>
                    )}
                    {rx.status === "Dispensed" && (
                      <span className="text-xs font-semibold text-muted">
                        <Icon name="check" size={12} className="inline mr-1 text-teal" />
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-table-state">
                    <Icon name="prescription" size={24} />
                    <p>No prescriptions match current filters.</p>
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
