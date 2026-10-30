import { useState, type FormEvent } from "react";
import { Icon } from "../Icons";
import { Patient } from "../../types";
import { departmentsList } from "../../data/seedData";

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (patient: Patient) => void;
  nextIdNumber: number;
}

export function RegisterPatientModal({
  isOpen,
  onClose,
  onRegister,
  nextIdNumber,
}: RegisterPatientModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("32");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [phone, setPhone] = useState("");
  const [email] = useState("");
  const [department, setDepartment] = useState(departmentsList[0]);
  const [attendingDoctor, setAttendingDoctor] = useState("Dr. Sarah Chen, MD");
  const [priority, setPriority] = useState<"Routine" | "Urgent" | "Emergency">("Routine");
  const [allergies, setAllergies] = useState("None known");
  const [diagnosis, setDiagnosis] = useState("");
  const [bp, setBp] = useState("120/80");
  const [heartRate, setHeartRate] = useState("72");
  const [temp, setTemp] = useState("36.8°C");
  const [spO2, setSpO2] = useState("99");

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim().replace(/\s+/g, " ");
    if (!trimmedName) return;

    const patientId = `ML-${String(nextIdNumber).padStart(4, "0")}`;
    const nowTime = new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

    const allergyList = allergies
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const newPatient: Patient = {
      id: patientId,
      name: trimmedName,
      age: parseInt(age, 10) || 30,
      gender,
      bloodGroup,
      phone: phone.trim() || "+1 (555) 000-0000",
      email: email.trim() || undefined,
      department,
      attendingDoctor,
      status: "In Queue",
      priority,
      time: nowTime,
      admissionDate: "Today",
      allergies: allergyList.length > 0 ? allergyList : ["None known"],
      diagnosis: diagnosis.trim() || "Initial triage assessment pending",
      vitals: {
        bp: bp.trim() || "120/80",
        heartRate: parseInt(heartRate, 10) || 72,
        temp: temp.trim() || "36.8°C",
        spO2: parseInt(spO2, 10) || 99,
      },
    };

    onRegister(newPatient);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-container modal-lg" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <div className="modal-badge">
              <Icon name="patient" size={14} />
              <span>NEW PATIENT ADMISSION</span>
            </div>
            <h2>Register New Patient</h2>
            <p>Enter patient intake records and initial clinical triage details</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section-title">1. Patient Identification & Demographics</div>
          <div className="form-grid-3">
            <div className="form-group col-span-2">
              <label>
                Full Name <span className="req">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Clara Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Age <span className="req">*</span></label>
              <input
                type="number"
                min="0"
                max="125"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Contact Phone <span className="req">*</span></label>
              <input
                type="tel"
                placeholder="+1 (555) 012-3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section-title">2. Clinical Department & Triage Priority</div>
          <div className="form-grid-3">
            <div className="form-group">
              <label>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                {departmentsList.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Attending Clinician</label>
              <select value={attendingDoctor} onChange={(e) => setAttendingDoctor(e.target.value)}>
                <option value="Dr. Sarah Chen, MD">Dr. Sarah Chen, MD (General Med)</option>
                <option value="Dr. Maya Patel, FAAP">Dr. Maya Patel, FAAP (Paediatrics)</option>
                <option value="Dr. Julian Ross, FACC">Dr. Julian Ross, FACC (Cardiology)</option>
                <option value="Dr. Kenneth Sterling, MS">Dr. Kenneth Sterling, MS (Orthopaedics)</option>
                <option value="Dr. Alistair Finch, OB/GYN">Dr. Alistair Finch, OB/GYN (Maternity)</option>
                <option value="Dr. Helen Wu, DDS">Dr. Helen Wu, DDS (Dental)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Triage Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                <option value="Routine">Routine (Level 3)</option>
                <option value="Urgent">Urgent (Level 2)</option>
                <option value="Emergency">Emergency (Level 1)</option>
              </select>
            </div>
          </div>

          <div className="form-section-title">3. Initial Vitals & Clinical Observation</div>
          <div className="form-grid-4">
            <div className="form-group">
              <label>Blood Pressure</label>
              <input value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" />
            </div>
            <div className="form-group">
              <label>Heart Rate (BPM)</label>
              <input value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="72" />
            </div>
            <div className="form-group">
              <label>Body Temp</label>
              <input value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="36.8°C" />
            </div>
            <div className="form-group">
              <label>Oxygen SpO2 (%)</label>
              <input value={spO2} onChange={(e) => setSpO2(e.target.value)} placeholder="99" />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Known Allergies (comma separated)</label>
              <input
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts, Latex"
              />
            </div>
            <div className="form-group">
              <label>Chief Complaint / Symptoms</label>
              <input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Persistent fever and dry cough for 3 days"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Icon name="check" size={16} /> Complete Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
