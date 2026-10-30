import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { RegisterPatientModal } from "./components/Modals/RegisterPatientModal";
import { BookAppointmentModal } from "./components/Modals/BookAppointmentModal";
import { PatientDetailsModal } from "./components/Modals/PatientDetailsModal";
import { AuthModal } from "./components/Modals/AuthModal";
import { CreateUserModal } from "./components/Modals/CreateUserModal";

import { OverviewPage } from "./pages/OverviewPage";
import { PatientsPage } from "./pages/PatientsPage";
import { QueuePage } from "./pages/QueuePage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { PrescriptionsPage } from "./pages/PrescriptionsPage";
import { LabReportsPage } from "./pages/LabReportsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { StaffUsersPage } from "./pages/StaffUsersPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";

import {
  Patient,
  Appointment,
  Prescription,
  LabReport,
  InventoryItem,
  ClinicalTask,
  UserAccount,
} from "./types";

import {
  initialPatients,
  initialAppointments,
  initialPrescriptions,
  initialLabReports,
  initialInventory,
  initialTasks,
  initialStaff,
} from "./data/seedData";

import {
  checkApiHealth,
  fetchCurrentUser,
  logoutUser,
  fetchUsers,
} from "./api/client";

export default function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [facilityName, setFacilityName] = useState("St. Jude Metropolitan Medical Center");
  const [searchQuery, setSearchQuery] = useState("");

  // Clinical & Operations Data State
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [labReports] = useState<LabReport[]>(initialLabReports);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [tasks] = useState<ClinicalTask[]>(initialTasks);
  const [staffUsers, setStaffUsers] = useState<UserAccount[]>(initialStaff);

  // Authentication & API Connection State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiLatency, setApiLatency] = useState(0);

  // Modal Open States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Health check check function
  const runHealthCheck = useCallback(async () => {
    try {
      const res = await checkApiHealth();
      setApiConnected(true);
      setApiLatency(res.latencyMs);

      // If connected, also check if user has active session
      const me = await fetchCurrentUser();
      if (me) {
        setCurrentUser({
          id: me.id,
          email: me.email,
          role: me.role,
          is_active: me.is_active,
          name: me.role === "administrator" ? "Hospital Administrator" : "Staff Clinician",
          title: me.role.toUpperCase(),
          department: "Medical Operations",
        });
      }
    } catch {
      setApiConnected(false);
      setApiLatency(0);
    }
  }, []);

  // Poll health on mount
  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(runHealthCheck, 30000);
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  // Sync staff users from API when connected and admin
  const syncApiUsers = useCallback(async () => {
    if (!apiConnected) return;
    try {
      const apiUsers = await fetchUsers();
      if (apiUsers && apiUsers.length > 0) {
        const mapped: UserAccount[] = apiUsers.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role,
          is_active: u.is_active,
          name: u.email.split("@")[0],
          title: u.role.toUpperCase(),
          department: "Clinical Staff",
          created_at: u.created_at,
        }));
        setStaffUsers((prev) => {
          const existingEmails = new Set(mapped.map((m) => m.email));
          const uniquePrev = prev.filter((p) => !existingEmails.has(p.email));
          return [...mapped, ...uniquePrev];
        });
      }
    } catch (e) {
      console.warn("Could not sync users from API:", e);
    }
  }, [apiConnected]);

  useEffect(() => {
    if (apiConnected && currentUser?.role === "administrator") {
      syncApiUsers();
    }
  }, [apiConnected, currentUser, syncApiUsers]);

  // Actions
  function handleRegisterPatient(newPatient: Patient) {
    setPatients((prev) => [newPatient, ...prev]);
  }

  function handleBookAppointment(newApt: Appointment) {
    setAppointments((prev) => [newApt, ...prev]);
  }

  function handlePatientStatusUpdate(patientId: string, status: Patient["status"]) {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status } : p))
    );
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient((prev) => (prev ? { ...prev, status } : null));
    }
  }

  function handleAppointmentStatusUpdate(id: string, status: Appointment["status"]) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  function handlePrescriptionStatusUpdate(id: string, status: Prescription["status"]) {
    setPrescriptions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  function handleRestock(id: string, amount: number) {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stockLevel: item.stockLevel + amount,
              status:
                item.stockLevel + amount > item.reorderThreshold
                  ? "In Stock"
                  : "Low Stock",
            }
          : item
      )
    );
  }

  async function handleLogout() {
    await logoutUser();
    setCurrentUser(null);
  }

  function handleUserCreated(newUser: UserAccount) {
    setStaffUsers((prev) => [newUser, ...prev]);
  }

  const waitingCount = patients.filter((p) => p.status === "In Queue").length;
  const pendingLabsCount = labReports.filter(
    (l) => l.resultStatus === "Pending" || l.resultStatus === "Abnormal"
  ).length;

  return (
    <div className="medilink-shell">
      {/* Sleek Responsive Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        counts={{
          patients: patients.length,
          appointments: appointments.length,
          prescriptions: prescriptions.length,
          labs: pendingLabsCount,
          queue: waitingCount,
        }}
        facilityName={facilityName}
      />

      {/* Main Workspace Area */}
      <div className="medilink-main">
        <Header
          activePage={activePage}
          facilityName={facilityName}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          apiConnected={apiConnected}
          apiLatency={apiLatency}
          onCheckHealth={runHealthCheck}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenAppointment={() => setIsAppointmentOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          currentUser={currentUser}
        />

        {/* Dynamic Route Pages */}
        <main className="medilink-content">
          {activePage === "Overview" && (
            <OverviewPage
              patients={patients}
              appointments={appointments}
              prescriptions={prescriptions}
              labReports={labReports}
              tasks={tasks}
              onNavigate={setActivePage}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onOpenAppointment={() => setIsAppointmentOpen(true)}
              onSelectPatient={setSelectedPatient}
              currentUser={currentUser}
            />
          )}

          {activePage === "Patients" && (
            <PatientsPage
              patients={patients}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onSelectPatient={setSelectedPatient}
              searchQuery={searchQuery}
            />
          )}

          {activePage === "Queue" && (
            <QueuePage
              patients={patients}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onSelectPatient={setSelectedPatient}
              onUpdateStatus={handlePatientStatusUpdate}
              searchQuery={searchQuery}
            />
          )}

          {activePage === "Appointments" && (
            <AppointmentsPage
              appointments={appointments}
              onOpenBookAppointment={() => setIsAppointmentOpen(true)}
              onUpdateStatus={handleAppointmentStatusUpdate}
              searchQuery={searchQuery}
            />
          )}

          {activePage === "Prescriptions" && (
            <PrescriptionsPage
              prescriptions={prescriptions}
              onUpdateStatus={handlePrescriptionStatusUpdate}
              searchQuery={searchQuery}
            />
          )}

          {activePage === "Lab reports" && (
            <LabReportsPage
              labReports={labReports}
              searchQuery={searchQuery}
            />
          )}

          {activePage === "Inventory" && (
            <InventoryPage
              inventory={inventory}
              onRestock={handleRestock}
              searchQuery={searchQuery}
            />
          )}

          {activePage === "Tasks" && (
            <div className="page-content">
              <div className="page-title-row">
                <div>
                  <div className="eyebrow-badge">
                    <span>CLINICAL WORKFLOW & COLLABORATION</span>
                  </div>
                  <h1>Clinical Tasks & Care Team Hand-offs</h1>
                  <p className="page-subtitle">
                    Active inpatient orders, medication reviews, and stat laboratory follow-ups.
                  </p>
                </div>
              </div>
              <div className="panel mt-4">
                <div className="panel-header">
                  <div>
                    <h2>Today's Priority Tasks</h2>
                    <p>{tasks.length} active items assigned to staff</p>
                  </div>
                </div>
                <div className="tasks-list p-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <div className="task-text">
                        <strong className="block text-sm">{task.title}</strong>
                        <small className="text-muted">
                          {task.department} · Assignee: <strong>{task.assignee}</strong> · Target: <strong>{task.dueTime}</strong>
                        </small>
                      </div>
                      <span className={`priority-pill priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === "Staff" && (
            <StaffUsersPage
              users={staffUsers}
              onOpenCreateUser={() => setIsCreateUserOpen(true)}
              apiConnected={apiConnected}
              onRefreshUsers={syncApiUsers}
              currentUser={currentUser}
              searchQuery={searchQuery}
            />
          )}

          {activePage === "Analytics" && <AnalyticsPage />}

          {activePage === "Settings" && (
            <SettingsPage
              facilityName={facilityName}
              onUpdateFacilityName={setFacilityName}
              apiConnected={apiConnected}
              apiLatency={apiLatency}
              onCheckHealth={runHealthCheck}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <RegisterPatientModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegisterPatient}
        nextIdNumber={patients.length + 1043}
      />

      <BookAppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        patients={patients}
        onBook={handleBookAppointment}
      />

      <PatientDetailsModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onUpdateStatus={handlePatientStatusUpdate}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={setCurrentUser}
        apiConnected={apiConnected}
      />

      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onUserCreated={handleUserCreated}
        apiConnected={apiConnected}
      />
    </div>
  );
}
