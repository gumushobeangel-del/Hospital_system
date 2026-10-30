import { useState, type FormEvent } from "react";
import { Icon } from "../Icons";
import { Appointment, Patient } from "../../types";
import { departmentsList } from "../../data/seedData";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onBook: (appointment: Appointment) => void;
}

export function BookAppointmentModal({
  isOpen,
  onClose,
  patients,
  onBook,
}: BookAppointmentModalProps) {
  const [patientId, setPatientId] = useState(patients[0]?.id || "");
  const [patientName, setPatientName] = useState(patients[0]?.name || "");
  const [doctorName, setDoctorName] = useState("Dr. Sarah Chen");
  const [department, setDepartment] = useState(departmentsList[0]);
  const [date, setDate] = useState("Today");
  const [time, setTime] = useState("13:00 - 13:30");
  const [type, setType] = useState<Appointment["type"]>("Consultation");
  const [room, setRoom] = useState("Consulting Room 102");

  if (!isOpen) return null;

  function handlePatientSelect(id: string) {
    setPatientId(id);
    const p = patients.find((item) => item.id === id);
    if (p) {
      setPatientName(p.name);
      setDepartment(p.department);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      patientId: patientId || "ML-9999",
      patientName: patientName || "Scheduled Patient",
      doctorName,
      department,
      time,
      date,
      type,
      room,
      status: "Confirmed",
    };
    onBook(newAppointment);
    onClose();
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
              <Icon name="calendar" size={14} />
              <span>CLINICAL SCHEDULING</span>
            </div>
            <h2>Schedule New Appointment</h2>
            <p>Assign clinical consultation time slot and assigned physician</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Patient</label>
            <select
              value={patientId}
              onChange={(e) => handlePatientSelect(e.target.value)}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) · {p.department}
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                {departmentsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Physician</label>
              <select value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
                <option value="Dr. Sarah Chen">Dr. Sarah Chen (General Med)</option>
                <option value="Dr. Julian Ross">Dr. Julian Ross (Cardiology)</option>
                <option value="Dr. Maya Patel">Dr. Maya Patel (Paediatrics)</option>
                <option value="Dr. Kenneth Sterling">Dr. Kenneth Sterling (Orthopaedics)</option>
                <option value="Dr. Alistair Finch">Dr. Alistair Finch (Maternity)</option>
                <option value="Dr. Helen Wu">Dr. Helen Wu (Dental)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Schedule Day</label>
              <select value={date} onChange={(e) => setDate(e.target.value)}>
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="In 2 Days">In 2 Days</option>
                <option value="Next Week">Next Week</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="14:00 - 14:30" />
            </div>
            <div className="form-group">
              <label>Room / Suite</label>
              <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room 204" />
            </div>
          </div>

          <div className="form-group">
            <label>Appointment Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="Consultation">Clinical Consultation</option>
              <option value="Follow-up">Post-op / Treatment Follow-up</option>
              <option value="Routine Checkup">Routine Health Screening</option>
              <option value="Specialist Review">Specialist Medical Review</option>
              <option value="Emergency">Urgent Clinical Review</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Icon name="calendar" size={16} /> Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
