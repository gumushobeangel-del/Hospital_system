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
            <button className="btn btn-secondary" onClick={onRefreshUsers}>
              <Icon name="refresh" size={15} /> Sync API
            </button>
          )}
          <button className="btn btn-primary" onClick={onOpenCreateUser}>
            <Icon name="plus" size={16} /> Provision Account
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="security-banner">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(20,184,166,0.15)",
            color: "var(--brand-400)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="lock" size={20} />
        </div>
        <div className="security-banner-text" style={{ flex: 1 }}>
          <strong>Cryptographic Password & Role Boundary Enforcement</strong>
          <p>
            Accounts are secured using Argon2id hashing with server-enforced role boundaries.
            {isAdmin
              ? " You have Administrator privileges and can provision accounts."
              : " Sign in with admin@example.com to persist accounts to the backend database."}
          </p>
        </div>
        <span
          className="badge badge-teal"
          style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
        >
          <Icon name="shield" size={12} /> Stage 1 Auth Ready
        </span>
      </div>

      {/* Role Filter */}
      <div className="filter-tabs">
        {["All", "administrator", "doctor", "nurse", "receptionist", "pharmacist", "laboratory", "accountant"].map(
          (role) => (
            <button
              key={role}
              className={`filter-chip ${roleFilter === role ? "active" : ""}`}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          )
        )}
      </div>

      {/* Staff Table */}
      <div className="panel">
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
                    <div className="staff-name-cell">
                      <div className="staff-avatar">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="staff-name-info">
                        <strong>{user.name || user.email.split("@")[0]}</strong>
                        <small>{user.title || user.role}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-sm">{user.email}</span>
                  </td>
                  <td>
                    <span className={`role-pill role-${user.role}`}>{user.role}</span>
                  </td>
                  <td>{user.department || "Clinical Operations"}</td>
                  <td>
                    <span className="status-pill status-completed">
                      <span className="status-dot" />
                      Active
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "var(--slate-500)",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Icon name="shield" size={13} className="text-teal" />
                      Argon2id · HttpOnly
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-table-state">
                      <Icon name="users" size={28} />
                      <p>No staff accounts match the filter.</p>
                    </div>
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
