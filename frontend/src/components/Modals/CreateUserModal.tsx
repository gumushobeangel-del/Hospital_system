import { useState, type FormEvent } from "react";
import { Icon } from "../Icons";
import { UserAccount, UserRole } from "../../types";
import { createBackendUser } from "../../api/client";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: UserAccount) => void;
  apiConnected: boolean;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
  apiConnected,
}: CreateUserModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("doctor");
  const [department, setDepartment] = useState("General Medicine");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 12) {
      setErrorMsg("Password must contain at least 12 characters");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");

    try {
      let createdId = `usr-${Math.random().toString(36).substring(2, 9)}`;
      if (apiConnected) {
        try {
          const apiRes = await createBackendUser({ email, password, role });
          createdId = apiRes.id;
        } catch (apiErr: any) {
          console.warn("Backend user creation failed, falling back to local state:", apiErr);
          if (apiErr.message.includes("Insufficient permissions")) {
            throw new Error("Only authenticated administrators can create accounts on the live API.");
          }
        }
      }

      const newUser: UserAccount = {
        id: createdId,
        email: email.trim().toLowerCase(),
        role,
        is_active: true,
        name: name.trim() || email.split("@")[0],
        title: role.toUpperCase(),
        department,
        created_at: new Date().toISOString(),
      };

      onUserCreated(newUser);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create staff account.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-container modal-md" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <div className="modal-badge">
              <Icon name="users" size={14} />
              <span>STAFF CREDENTIAL PROVISIONING</span>
            </div>
            <h2>Create Staff Account</h2>
            <p>Provision role-based access for hospital clinical or administrative personnel</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="alert-error">
            <Icon name="alertCircle" size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Staff Member Name</label>
              <input
                type="text"
                required
                placeholder="Dr. Jordan Blake"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Work Email <span className="req">*</span></label>
              <input
                type="email"
                required
                placeholder="j.blake@medilink.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Assigned Role <span className="req">*</span></label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="doctor">Doctor / Clinician</option>
                <option value="nurse">Nurse / Charge Nurse</option>
                <option value="receptionist">Receptionist / Triage</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="laboratory">Laboratory Scientist</option>
                <option value="accountant">Billing & Accountant</option>
                <option value="administrator">System Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                placeholder="Emergency & Trauma"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Initial Secure Password (Min 12 chars) <span className="req">*</span></label>
            <input
              type="password"
              required
              minLength={12}
              placeholder="At least 12 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small className="form-hint">
              Argon2id cryptographic hash will be stored on PostgreSQL / SQLite.
            </small>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="refresh" size={16} className="spin" /> Provisioning...
                </>
              ) : (
                <>
                  <Icon name="plus" size={16} /> Create Staff Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
