import { Icon } from "./Icons";
import { UserAccount } from "../types";

export interface NavGroup {
  label: string;
  items: {
    id: string;
    label: string;
    icon: string;
    badge?: number | string;
    badgeColor?: "teal" | "amber" | "rose" | "slate";
  }[];
}

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  counts: {
    patients: number;
    appointments: number;
    prescriptions: number;
    labs: number;
    queue: number;
  };
  facilityName: string;
}

export function Sidebar({
  activePage,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  counts,
  facilityName,
}: SidebarProps) {
  const navigationGroups: NavGroup[] = [
    {
      label: "WORKSPACE",
      items: [{ id: "Overview", label: "Overview", icon: "grid" }],
    },
    {
      label: "CLINICAL CARE",
      items: [
        {
          id: "Patients",
          label: "Patients Registry",
          icon: "patient",
          badge: counts.patients,
          badgeColor: "teal",
        },
        {
          id: "Queue",
          label: "Triage & Queue",
          icon: "activity",
          badge: counts.queue,
          badgeColor: "amber",
        },
        {
          id: "Appointments",
          label: "Appointments",
          icon: "calendar",
          badge: counts.appointments,
        },
        {
          id: "Prescriptions",
          label: "Pharmacy & Rx",
          icon: "prescription",
          badge: counts.prescriptions,
          badgeColor: "teal",
        },
        {
          id: "Lab reports",
          label: "Lab & Diagnostics",
          icon: "lab",
          badge: counts.labs,
          badgeColor: "rose",
        },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        { id: "Inventory", label: "Medical Supplies", icon: "inventory" },
        { id: "Tasks", label: "Clinical Tasks", icon: "tasks" },
        { id: "Analytics", label: "Facility Analytics", icon: "chart" },
      ],
    },
    {
      label: "ADMINISTRATION",
      items: [
        { id: "Staff", label: "Staff & RBAC", icon: "users" },
        { id: "Settings", label: "Settings & API", icon: "settings" },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand & Logo */}
      <div className="brand-header">
        <div className="brand-logo" onClick={() => onNavigate("Overview")}>
          <div className="brand-icon-wrap">
            <Icon name="medical" size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-title">MediLink</span>
            <span className="brand-sub">HEALTH PLATFORM</span>
          </div>
        </div>
      </div>

      {/* Facility Switcher */}
      <div className="facility-badge-box">
        <div className="facility-icon-wrap">
          <Icon name="hospital" size={16} />
        </div>
        <div className="facility-info">
          <strong>{facilityName}</strong>
          <small>Trauma Center Level II</small>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="nav-container" aria-label="Main Navigation">
        {navigationGroups.map((group) => (
          <div key={group.label} className="nav-section">
            <span className="nav-heading">{group.label}</span>
            <div className="nav-items">
              {group.items.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-button ${isActive ? "active" : ""}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    <span className="nav-btn-icon">
                      <Icon name={item.icon} size={17} />
                    </span>
                    <span className="nav-btn-text">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`nav-badge badge-${item.badgeColor || "slate"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Session Profile Footer */}
      <div className="sidebar-footer">
        {currentUser ? (
          <div className="user-profile-card">
            <div className="user-avatar-sm">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-info-text">
              <strong>{currentUser.name || currentUser.email}</strong>
              <span className={`role-pill role-${currentUser.role}`}>
                {currentUser.role}
              </span>
            </div>
            <button
              className="btn-icon-ghost"
              title="Sign Out"
              onClick={onLogout}
              aria-label="Sign Out"
            >
              <Icon name="logout" size={15} />
            </button>
          </div>
        ) : (
          <div className="guest-login-banner" onClick={onOpenAuth}>
            <div className="flex items-center gap-2">
              <span className="guest-dot" />
              <div>
                <strong>Signed in as Guest</strong>
                <small className="block text-muted">Click to log in as Staff / Admin</small>
              </div>
            </div>
            <Icon name="login" size={16} />
          </div>
        )}
      </div>
    </aside>
  );
}
