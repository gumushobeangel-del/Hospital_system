import { useState, useEffect } from "react";
import { Icon } from "./Icons";
import { UserAccount } from "../types";

interface HeaderProps {
  activePage: string;
  facilityName: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  apiConnected: boolean;
  apiLatency: number;
  onCheckHealth: () => void;
  onOpenRegister: () => void;
  onOpenAppointment: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
}

export function Header({
  activePage,
  facilityName,
  searchQuery,
  onSearchChange,
  apiConnected,
  apiLatency,
  onCheckHealth,
  onOpenRegister,
  onOpenAppointment,
  onOpenAuth,
  currentUser,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="app-header">
      {/* Breadcrumb path */}
      <div className="header-left">
        <div className="breadcrumbs">
          <span className="crumb-root">{facilityName}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{activePage}</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="header-search">
        <div className="search-input-wrapper">
          <Icon name="search" size={16} className="search-icon" />
          <input
            type="search"
            placeholder="Search patients, doctors, records, or orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <Icon name="close" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions & Status */}
      <div className="header-right">
        {/* Backend API status badge */}
        <button
          className={`api-status-pill ${apiConnected ? "connected" : "standalone"}`}
          onClick={onCheckHealth}
          title="Click to check FastAPI backend connectivity"
        >
          <span className="status-dot-pulse" />
          <span className="api-status-text">
            {apiConnected ? `API Online (${apiLatency}ms)` : "Preview Mode"}
          </span>
          <Icon name="refresh" size={12} className="refresh-icon" />
        </button>

        {/* Live Date and Clock */}
        <div className="header-datetime">
          <span className="header-date">{todayStr}</span>
          <span className="header-clock">{timeStr}</span>
        </div>

        {/* Action Buttons */}
        <div className="header-actions">
          <button
            className="btn btn-sm btn-outline-teal"
            onClick={onOpenAppointment}
            title="Book new consultation"
          >
            <Icon name="calendar" size={14} />
            <span>Book Appointment</span>
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={onOpenRegister}
            title="Admit new patient"
          >
            <Icon name="plus" size={15} />
            <span>Register Patient</span>
          </button>
        </div>

        {/* User Account Button */}
        <button
          className="user-header-btn"
          onClick={onOpenAuth}
          title={currentUser ? `Signed in as ${currentUser.email}` : "Click to sign in"}
        >
          <div className="header-avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "M"}
          </div>
          {currentUser && (
            <span className="header-user-role">{currentUser.role}</span>
          )}
        </button>
      </div>
    </header>
  );
}
