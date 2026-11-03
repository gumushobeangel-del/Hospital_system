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
  onOpenSidebar: () => void;
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
  onOpenSidebar,
  currentUser,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      {/* Hamburger (mobile only) */}
      <button
        className="hamburger-btn"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Breadcrumb / Page title */}
      <div className="header-left">
        <div className="breadcrumbs">
          <span className="crumb-root">{facilityName}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{activePage}</span>
        </div>
        {/* Mobile: active page only */}
        <span className="mobile-page-title">{activePage}</span>
      </div>

      {/* Center Search — desktop */}
      <div className="header-search">
        <div className="search-input-wrapper">
          <Icon name="search" size={16} className="search-icon" />
          <input
            type="search"
            placeholder="Search patients, records..."
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

      {/* Right Actions */}
      <div className="header-right">
        {/* Mobile search toggle */}
        <button
          className="mobile-search-btn"
          onClick={() => setShowMobileSearch((v) => !v)}
          aria-label="Toggle search"
        >
          <Icon name="search" size={18} />
        </button>

        {/* API status pill */}
        <button
          className={`api-status-pill ${apiConnected ? "connected" : "standalone"}`}
          onClick={onCheckHealth}
          title="Check API connectivity"
        >
          <span className="status-dot-pulse" />
          <span className="api-status-text">
            {apiConnected ? `API (${apiLatency}ms)` : "Preview"}
          </span>
          <Icon name="refresh" size={12} className="refresh-icon" />
        </button>

        {/* Date/time — hidden on mobile */}
        <div className="header-datetime">
          <span className="header-date">{todayStr}</span>
          <span className="header-clock">{timeStr}</span>
        </div>

        {/* Action buttons */}
        <div className="header-actions">
          <button
            className="btn btn-sm btn-outline-teal"
            onClick={onOpenAppointment}
            title="Book new consultation"
          >
            <Icon name="calendar" size={14} />
            <span className="btn-label">Book Appointment</span>
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={onOpenRegister}
            title="Admit new patient"
          >
            <Icon name="plus" size={15} />
            <span className="btn-label">Register Patient</span>
          </button>
        </div>

        {/* User avatar */}
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

      {/* Mobile expandable search bar */}
      {showMobileSearch && (
        <div className="mobile-search-bar">
          <div className="search-input-wrapper">
            <Icon name="search" size={16} className="search-icon" />
            <input
              type="search"
              placeholder="Search patients, records..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => onSearchChange("")}
                aria-label="Clear"
              >
                <Icon name="close" size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
