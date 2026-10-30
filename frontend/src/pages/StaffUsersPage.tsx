import { useState } from "react";
import { Icon } from "../components/Icons";
import { UserAccount } from "../types";

interface StaffUsersPageProps {
  users: UserAccount[];
  onOpenCreateUser: () => void;
  apiConnected: boolean;
  onRefreshUsers: () => void;
  currentUser: UserAccount | null;
  searchQuery: string;
}

export function StaffUsersPage({
  users,
  onOpenCreateUser,
  apiConnected,
  onRefreshUsers,
  currentUser,
  searchQuery,
}: StaffUsersPageProps) {
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchSearch =
      searchQuery === "" ||
      `${u.email} ${u.name || ""} ${u.role} ${u.department || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const isAdmin = currentUser?.role === "administrator";

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div>
          <div className="eyebrow-badge">
            <Icon name="shield" size={13} />
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
          </div>
          <h1>Staff Directory & Account Management</h1>
          <p className="page-subtitle">
            Manage hospital personnel credentials, departmental roles, and access boundaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {apiConnected && (
            <button className="btn btn-secondary" onClick={onRefreshUsers} title="Refresh from API">
              <Icon name="refresh" size={15} /> Sync API
            </button>
          )}
          <button className="btn btn-primary" onClick={onOpenCreateUser}>
            <Icon name="plus" size={16} /> Provision Staff Account
          </button>
        </div>
      </div>

      {/* Security Info Card */}
      <div className="security-banner-card">
        <div className="security-icon-wrap">
          <Icon name="lock" size={20} />
        </div>
        <div className="security-text">
          <strong>Cryptographic Password & Role Boundary Enforcement</strong>
          <p>
            Accounts are secured using Argon2id hashing with server-enforced role dependencies.
            {isAdmin
              ? " You are signed in with Administrator privileges and can provision accounts."
              : " Sign in with an Administrator account (admin@example.com) to persist accounts to PostgreSQL / SQLite."}
          </p>
        </div>
        <div className="security-badge">
          <Icon name="shield" size={14} />
          <span>Stage 1 Auth Ready</span>
        </div>
      </div>

      {/* Role Filter Chips */}
      <div className="filter-controls-card mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted">ROLE:</span>
          {[
            "All",
            "administrator",
            "doctor",
            "nurse",
            "receptionist",
            "pharmacist",
            "laboratory",
            "accountant",
          ].map((role) => (
            <button
              key={role}
              className={`pill-btn ${roleFilter === role ? "active" : ""}`}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <div className="panel mt-4">
        <div className="panel-header">
          <div>
            <h2>Hospital Personnel Directory</h2>
            <p>Showing {filtered.length} authenticated personnel</p>
          </div>
          <span className="badge badge-teal">{filtered.length} Staff Members</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>PERSONNEL</th>
                <th>WORK EMAIL</th>
                <th>SYSTEM ROLE</th>
                <th>DEPARTMENT</th>
                <th>ACCOUNT STATUS</th>
                <th>AUTHENTICATION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="patient-name-cell">
                      <div className="patient-avatar-sm">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{user.name || user.email.split("@")[0]}</strong>
                        <small className="block text-muted">{user.title || user.role}</small>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{user.email}</td>
                  <td>
                    <span className={`role-pill role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.department || "Clinical Operations"}</td>
                  <td>
                    <span className="status-pill status-in-queue">
                      <span className="status-dot" />
                      Active
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-muted">
                      <Icon name="shield" size={12} className="inline mr-1 text-teal" />
                      Argon2id / HttpOnly
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-table-state">
                    <Icon name="users" size={24} />
                    <p>No staff accounts match the filter.</p>
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
