import { useState } from "react";
import { Icon } from "../components/Icons";
import { LabReport } from "../types";

interface LabReportsPageProps {
  labReports: LabReport[];
  searchQuery: string;
}

export function LabReportsPage({ labReports, searchQuery }: LabReportsPageProps) {
  const [catFilter, setCatFilter] = useState("All");

  const filtered = labReports.filter((lab) => {
    const matchSearch =
      searchQuery === "" ||
      `${lab.testName} ${lab.patientName} ${lab.orderingDoctor} ${lab.category} ${lab.findings || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchCat = catFilter === "All" || lab.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="lab" size={13} />
            <span>DIAGNOSTIC PATHOLOGY & LABS</span>
          </div>
          <h1>Laboratory & Diagnostic Reports</h1>
          <p className="page-subtitle">
            Pathology specimen processing, arterial blood gases, radiological imaging, and bio-assays.
          </p>
        </div>
      </div>

      <div className="filter-controls-card">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted">DISCIPLINE:</span>
          {["All", "Hematology", "Biochemistry", "Radiology", "Microbiology"].map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${catFilter === cat ? "active" : ""}`}
              onClick={() => setCatFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Diagnostic Orders & Results</h2>
            <p>Showing {filtered.length} laboratory records</p>
          </div>
          <span className="badge badge-teal">{filtered.length} Diagnostic Tests</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>TEST PROCEDURE</th>
                <th>PATIENT</th>
                <th>ORDERING DOCTOR</th>
                <th>SPECIMEN / DISCIPLINE</th>
                <th>TURNAROUND</th>
                <th>RESULT FLAG</th>
                <th>CLINICAL FINDINGS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lab) => (
                <tr key={lab.id}>
                  <td className="font-mono text-xs font-bold text-muted">{lab.id}</td>
                  <td>
                    <strong>{lab.testName}</strong>
                    <small className="block text-muted">{lab.date}</small>
                  </td>
                  <td>
                    <strong>{lab.patientName}</strong>
                    <small className="block text-muted">{lab.patientId}</small>
                  </td>
                  <td>{lab.orderingDoctor}</td>
                  <td>
                    <span className="badge badge-slate">{lab.category}</span>
                    <small className="block text-muted">{lab.sampleType}</small>
                  </td>
                  <td>
                    <span className="text-xs text-muted">
                      <Icon name="clock" size={12} className="inline mr-1" />
                      {lab.turnaroundTime}
                    </span>
                  </td>
                  <td>
                    <span className={`result-badge result-${lab.resultStatus.toLowerCase()}`}>
                      {lab.resultStatus}
                    </span>
                  </td>
                  <td className="max-w-xs">
                    <p className="text-xs text-secondary truncate-2-lines">
                      {lab.findings || "Specimen currently in processing pipeline."}
                    </p>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-table-state">
                    <Icon name="lab" size={24} />
                    <p>No laboratory reports match the search criteria.</p>
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
