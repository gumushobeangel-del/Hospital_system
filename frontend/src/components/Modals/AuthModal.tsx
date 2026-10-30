import { useState, type FormEvent } from "react";
import { Icon } from "../Icons";
import { UserAccount, UserRole } from "../../types";
import { loginUser } from "../../api/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  apiConnected: boolean;
}

export function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  apiConnected,
}: AuthModalProps) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin-secure-password-12345");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleRealLogin(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await loginUser(email, password);
      const user: UserAccount = {
        id: result.id,
        email: result.email,
        role: result.role,
        is_active: result.is_active,
        name: result.role === "administrator" ? "Hospital Administrator" : "Attending Doctor",
        title: result.role === "administrator" ? "System Admin & Operations" : "Staff Clinician",
        department: result.role === "administrator" ? "Executive Leadership" : "General Medicine",
      };
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Verify backend API is running.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleDemoSwitch(role: UserRole, demoEmail: string, name: string, title: string) {
    const user: UserAccount = {
      id: `usr-demo-${role}`,
      email: demoEmail,
      role,
      is_active: true,
      name,
      title,
      department: "Clinical Operations",
    };
    onLoginSuccess(user);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-container modal-sm" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <div className="modal-badge">
              <Icon name="lock" size={14} />
              <span>AUTHENTICATION & ACCESS</span>
            </div>
            <h2>Sign In to MediLink</h2>
            <p>Access hospital operations with your staff account</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="auth-status-bar">
          <div className="flex items-center gap-2">
            <span className={`pulse-indicator ${apiConnected ? "online" : "offline"}`} />
            <span className="text-xs font-semibold">
              {apiConnected ? "Backend API Online (FastAPI)" : "Local Demo Mode"}
            </span>
          </div>
          <span className="text-xs text-muted">Strict HttpOnly Session</span>
        </div>

        {errorMessage && (
          <div className="alert-error">
            <Icon name="alertCircle" size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRealLogin} className="modal-form">
          <div className="form-group">
            <label>Staff Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icon name="refresh" size={16} className="spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                <Icon name="login" size={16} /> Sign In with API
              </>
            )}
          </button>
        </form>

        <div className="demo-credentials-box">
          <div className="demo-box-head">
            <Icon name="shield" size={14} />
            <span>Quick Role Switcher (Preview / Testing)</span>
          </div>
          <div className="demo-chips">
            <button
              type="button"
              className="demo-chip"
              onClick={() => {
                setEmail("admin@example.com");
                setPassword("admin-secure-password-12345");
                handleDemoSwitch(
                  "administrator",
                  "admin@example.com",
                  "Dr. Arthur Sterling",
                  "Administrator & CMO"
                );
              }}
            >
              <span className="role-tag admin">Admin</span>
              <span>admin@example.com</span>
            </button>

            <button
              type="button"
              className="demo-chip"
              onClick={() => {
                setEmail("doctor@example.com");
                setPassword("test-doctor-password-123");
                handleDemoSwitch(
                  "doctor",
                  "doctor@example.com",
                  "Dr. Sarah Chen, MD",
                  "Attending Physician"
                );
              }}
            >
              <span className="role-tag doctor">Doctor</span>
              <span>doctor@example.com</span>
            </button>

            <button
              type="button"
              className="demo-chip"
              onClick={() => {
                handleDemoSwitch(
                  "receptionist",
                  "reception@medilink.org",
                  "Chloe Bennett",
                  "Triage Coordinator"
                );
              }}
            >
              <span className="role-tag receptionist">Receptionist</span>
              <span>reception@medilink.org</span>
            </button>

            <button
              type="button"
              className="demo-chip"
              onClick={() => {
                handleDemoSwitch(
                  "pharmacist",
                  "pharmacy@medilink.org",
                  "David Miller, PharmD",
                  "Lead Pharmacist"
                );
              }}
            >
              <span className="role-tag pharmacist">Pharmacist</span>
              <span>pharmacy@medilink.org</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary w-full" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
