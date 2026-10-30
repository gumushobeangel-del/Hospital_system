import React, { useState } from "react";
import { Icon } from "../components/Icons";
import { checkApiHealth, HealthResponse } from "../api/client";

interface SettingsPageProps {
  facilityName: string;
  onUpdateFacilityName: (name: string) => void;
  apiConnected: boolean;
  apiLatency: number;
  onCheckHealth: () => void;
}

export function SettingsPage({
  facilityName,
  onUpdateFacilityName,
  apiConnected,
  apiLatency,
  onCheckHealth,
}: SettingsPageProps) {
  const [nameInput, setNameInput] = useState(facilityName);
  const [traumaLevel, setTraumaLevel] = useState("Level II Trauma Center");
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [healthResult, setHealthResult] = useState<HealthResponse | null>(null);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    onUpdateFacilityName(nameInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

  async function handleRunHealthCheck() {
    setIsTesting(true);
    try {
      const res = await checkApiHealth();
      setHealthResult(res);
      onCheckHealth();
    } catch {
      setHealthResult(null);
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="settings" size={13} />
            <span>SYSTEM PREFERENCES & ARCHITECTURE</span>
          </div>
          <h1>Facility Settings & System Status</h1>
          <p className="page-subtitle">
            Configure institutional profile, manage database connection, and verify security protocols.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Facility Information */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Facility Identification</h2>
              <p>Institutional branding and emergency registration</p>
            </div>
            {isSaved && <span className="badge badge-teal">Settings Saved</span>}
          </div>

          <form onSubmit={handleSaveProfile} className="settings-form-body">
            <div className="form-group">
              <label>Medical Center / Hospital Name</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="St. Jude Metropolitan Medical Center"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Accreditation & Trauma Level</label>
                <select
                  value={traumaLevel}
                  onChange={(e) => setTraumaLevel(e.target.value)}
                >
                  <option value="Level I Comprehensive Trauma">Level I Comprehensive Trauma</option>
                  <option value="Level II Trauma Center">Level II Trauma Center</option>
                  <option value="Level III Community Hospital">Level III Community Hospital</option>
                  <option value="Specialist Ambulatory Clinic">Specialist Ambulatory Clinic</option>
                </select>
              </div>
              <div className="form-group">
                <label>Emergency Dispatch Line</label>
                <input
                  type="text"
                  defaultValue="+1 (555) 911-0044"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Hospital Physical Address</label>
              <input
                type="text"
                defaultValue="742 Evergreen Terrace, Medical District Suite 400"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Icon name="check" size={15} /> Save Facility Profile
            </button>
          </form>
        </div>

        {/* Right Column: API & Backend Diagnostics */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>FastAPI Backend & Security Telemetry</h2>
              <p>Stage 1 API connectivity and session status</p>
            </div>
            <span className={`badge ${apiConnected ? "badge-teal" : "badge-amber"}`}>
              {apiConnected ? "API Connected" : "Preview Mode"}
            </span>
          </div>

          <div className="settings-form-body">
            <div className="api-diagnostic-box">
              <div className="diag-row">
                <span className="diag-label">FastAPI REST Server:</span>
                <strong className={apiConnected ? "text-teal" : "text-amber"}>
                  {apiConnected ? `Online · Latency: ${apiLatency}ms` : "Offline (Local Preview Active)"}
                </strong>
              </div>
              <div className="diag-row">
                <span className="diag-label">Health Endpoint:</span>
                <span className="font-mono text-xs">GET /health</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Authentication:</span>
                <span className="font-mono text-xs">Signed HttpOnly Cookie (SameSite=Strict)</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Password Cipher:</span>
                <span className="font-mono text-xs">Argon2id (passlib)</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Database Target:</span>
                <span className="font-mono text-xs">PostgreSQL (Prod) / SQLite (Dev)</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={handleRunHealthCheck}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Icon name="refresh" size={14} className="spin" /> Pinging /health...
                  </>
                ) : (
                  <>
                    <Icon name="refresh" size={14} /> Ping FastAPI Health
                  </>
                )}
              </button>
            </div>

            {healthResult && (
              <div className="alert-success mt-3">
                <Icon name="check" size={14} />
                <span>
                  Backend responded: <strong>status: {healthResult.status}</strong> in{" "}
                  <strong>{healthResult.latencyMs}ms</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
