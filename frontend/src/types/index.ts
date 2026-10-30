export type UserRole =
  | "administrator"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "pharmacist"
  | "laboratory"
  | "accountant"
  | "patient";

export interface UserAccount {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
  name?: string;
  title?: string;
  department?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  phone: string;
  email?: string;
  department: string;
  attendingDoctor: string;
  roomNumber?: string;
  status: "In Queue" | "In Consultation" | "Admitted" | "Observation" | "Discharged";
  priority: "Routine" | "Urgent" | "Emergency";
  time: string;
  admissionDate: string;
  allergies: string[];
  diagnosis?: string;
  vitals?: {
    bp: string;
    heartRate: number;
    temp: string;
    spO2: number;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  time: string;
  date: string;
  type: "Consultation" | "Follow-up" | "Routine Checkup" | "Specialist Review" | "Emergency";
  room: string;
  status: "Confirmed" | "Waiting" | "In Progress" | "Completed" | "Canceled";
}

export interface Prescription {
  id: string;
  rxNumber: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: "Dispensed" | "Pending Review" | "Ready for Pickup";
  notes?: string;
}

export interface LabReport {
  id: string;
  testName: string;
  patientId: string;
  patientName: string;
  orderingDoctor: string;
  category: "Hematology" | "Biochemistry" | "Microbiology" | "Radiology" | "Pathology";
  date: string;
  turnaroundTime: string;
  resultStatus: "Normal" | "Abnormal" | "Critical" | "Pending";
  sampleType: string;
  findings?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Pharmaceuticals" | "Consumables" | "PPE" | "Diagnostic Supplies" | "Surgical";
  stockLevel: number;
  reorderThreshold: number;
  unit: string;
  location: string;
  status: "In Stock" | "Low Stock" | "Critical";
}

export interface ClinicalTask {
  id: string;
  title: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignee: string;
  dueTime: string;
  completed: boolean;
}

export interface FacilityMetrics {
  totalPatients: number;
  activeQueue: number;
  todayAppointments: number;
  pendingLabs: number;
  activePrescriptions: number;
  bedOccupancyRate: number;
  avgWaitTimeMinutes: number;
}
