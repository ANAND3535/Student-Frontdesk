'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  CalendarDays,
} from 'lucide-react';
import { SAMPLE_APPOINTMENTS } from '@/lib/data';
import { formatDate, generateId } from '@/lib/utils';
import type { Appointment, AppointmentStatus, AppointmentType } from '@/types';

const APPOINTMENT_TYPES: AppointmentType[] = [
  'Academic Counseling',
  'Career Guidance',
  'Fee Discussion',
  'Admission Enquiry',
  'General Meeting',
  'Other',
];

const STAFF_LIST = [
  { name: 'Dr. Meera Pillai', department: 'Student Affairs' },
  { name: 'Mr. Dinesh Kumar', department: 'Finance Office' },
  { name: 'Ms. Anita Sharma', department: 'Placement Cell' },
  { name: 'Mr. Prasad Naik', department: 'Admissions' },
  { name: 'Dr. Priya Suresh', department: 'Computer Science' },
  { name: 'Prof. Ramesh Iyer', department: 'Academic Affairs' },
];

const TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const STATUS_CONFIG: Record<AppointmentStatus, { bg: string; color: string; border: string }> = {
  Scheduled: { bg: '#EEF3FF', color: '#1E4BD8', border: 'rgba(43, 92, 255, 0.2)' },
  Completed: { bg: '#E7F7F0', color: '#0E6E4C', border: 'rgba(22, 166, 115, 0.2)' },
  Cancelled: { bg: '#FEECEE', color: '#B91C1C', border: 'rgba(229, 72, 77, 0.2)' },
  Rescheduled: { bg: '#FEF6E7', color: '#B45309', border: 'rgba(245, 158, 11, 0.2)' },
  'No Show': { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
};

function BookingModal({ onClose, onBook }: { onClose: () => void; onBook: (a: Appointment) => void }) {
  const [form, setForm] = useState({
    studentName: '',
    studentId: '',
    email: '',
    phone: '',
    type: 'Academic Counseling' as AppointmentType,
    staffIndex: 0,
    date: '2026-10-28',
    time: '10:00',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const staff = STAFF_LIST[form.staffIndex];
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.studentName,
          staffName: staff.name,
          type: form.type,
        }),
      });
      const data = await res.json();
      const appt: Appointment = {
        id: data.id || generateId(),
        studentName: form.studentName,
        studentId: form.studentId,
        email: form.email,
        phone: form.phone,
        type: form.type,
        staffName: staff.name,
        department: staff.department,
        date: form.date,
        time: form.time,
        duration: 30,
        status: 'Scheduled',
        notes: form.notes,
        createdAt: new Date().toISOString(),
      };
      onBook(appt);
    } catch {
      const appt: Appointment = {
        id: generateId(),
        studentName: form.studentName,
        studentId: form.studentId,
        email: form.email,
        phone: form.phone,
        type: form.type,
        staffName: staff.name,
        department: staff.department,
        date: form.date,
        time: form.time,
        duration: 30,
        status: 'Scheduled',
        notes: form.notes,
        createdAt: new Date().toISOString(),
      };
      onBook(appt);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#0B1426]/50 backdrop-blur-xs" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-slide-right overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#EAEFF5] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-[#0B1426]">Schedule New Appointment</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Book slots with faculty, advisors, and admin leads</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0B1426] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
                Student Name <span className="text-[#E5484D]">*</span>
              </label>
              <input
                type="text"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className={`w-full h-10 px-3 text-sm bg-white rounded-lg border ${
                  errors.studentName ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
                } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all`}
                placeholder="e.g. Kiran Bhat"
              />
              {errors.studentName && <p className="text-xs text-[#E5484D] mt-1">{errors.studentName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Student ID</label>
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
                placeholder="STU2024055"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
                Email Address <span className="text-[#E5484D]">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full h-10 px-3 text-sm bg-white rounded-lg border ${
                  errors.email ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
                } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all`}
                placeholder="kiran.bhat@student.edu"
              />
              {errors.email && <p className="text-xs text-[#E5484D] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
                placeholder="+91 90123 45678"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Appointment Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as AppointmentType })}
              className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
            >
              {APPOINTMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Staff Member Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Select Staff Member</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STAFF_LIST.map((staff, i) => {
                const isSelected = form.staffIndex === i;
                return (
                  <button
                    key={staff.name}
                    type="button"
                    onClick={() => setForm({ ...form, staffIndex: i })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-[#EEF3FF] border-[#2B5CFF] ring-1 ring-[#2B5CFF]'
                        : 'bg-white border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#0B1426] truncate">{staff.name}</div>
                    <div className="text-[11px] text-[#64748B] truncate mt-0.5">{staff.department}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
                Date <span className="text-[#E5484D]">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={`w-full h-10 px-3 text-sm bg-white rounded-lg border ${
                  errors.date ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
                } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all`}
              />
              {errors.date && <p className="text-xs text-[#E5484D] mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Time Slot</label>
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
              >
                {TIMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Discussion Agenda (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full p-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all resize-none"
              placeholder="e.g. Review degree audit and elective recommendations..."
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#EAEFF5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#2B5CFF] hover:bg-[#1E4BD8] rounded-lg shadow-xs transition-all disabled:opacity-60"
            >
              {submitting ? 'Scheduling...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(SAMPLE_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        if (data.success && Array.isArray(data.appointments) && data.appointments.length > 0) {
          setAppointments(data.appointments);
          setIsSynced(true);
        }
      } catch (e) {
        console.warn('Fallback to sample appointments', e);
      }
    }
    loadAppointments();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = appointments.filter(
    (a) =>
      (statusFilter === 'All' || a.status === statusFilter) &&
      (a.studentName.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.staffName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBook = (appt: Appointment) => {
    setAppointments((prev) => [appt, ...prev]);
    setShowModal(false);
    showToast(`Appointment scheduled with ${appt.staffName} on ${formatDate(appt.date)} at ${appt.time}`);
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    showToast(`Appointment status updated to ${status}`);
  };

  const upcomingCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  return (
    <div className="space-y-6 animate-fade-in w-full min-w-0">
      {/* ================= HEADER & ACTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#EAEFF5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1426]">Appointment Schedule</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Coordinate counseling sessions, faculty appointments, and admission reviews
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2B5CFF] hover:bg-[#1E4BD8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* ================= SUMMARY STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#1E4BD8]">{upcomingCount}</div>
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">Upcoming Sessions</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EEF3FF] flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-[#2B5CFF]" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#0E6E4C]">{completedCount}</div>
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">Completed Sessions</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E7F7F0] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#16A673]" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#B91C1C]">{cancelledCount}</div>
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">Cancelled / Rescheduled</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FEECEE] flex items-center justify-center">
            <X className="w-5 h-5 text-[#E5484D]" />
          </div>
        </div>
      </div>

      {/* ================= SEARCH & STATUS FILTER ================= */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search appointments by student or staff member..."
            className="w-full h-10 pl-9 pr-4 text-sm bg-white text-[#0B1426] placeholder-[#94A3B8] rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EEF3FF] rounded-lg overflow-x-auto self-start sm:self-auto">
          {(['All', 'Scheduled', 'Completed', 'Cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-white text-[#2B5CFF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1426]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ================= APPOINTMENTS CARDS LIST ================= */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#EAEFF5] p-12 text-center text-[#64748B] shadow-xs">
            <Calendar className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[#0B1426]">No scheduled appointments found</p>
            <p className="text-xs text-[#64748B] mt-0.5">Try searching with a different term or schedule a new appointment</p>
          </div>
        ) : (
          filtered.map((appt) => {
            const cfg = STATUS_CONFIG[appt.status];
            const dateObj = new Date(appt.date + 'T00:00:00');
            const dayNum = dateObj.getDate();
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' });

            return (
              <div
                key={appt.id}
                className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Razorpay Calendar Badge */}
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-[#EEF3FF] border border-[#2B5CFF]/20 flex flex-col items-center justify-center text-[#2B5CFF]">
                    <span className="text-lg font-bold leading-none">{dayNum}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{monthStr}</span>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F5F9] text-[#334155]">
                            {appt.type}
                          </span>
                          <span className="text-xs text-[#64748B] font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#94A3B8]" />
                            {appt.time} ({appt.duration} min)
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#0B1426] truncate">
                          Student: {appt.studentName} {appt.studentId && `(${appt.studentId})`}
                        </h3>

                        <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5 flex-wrap">
                          <BookOpen className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>With: <strong className="text-[#475569]">{appt.staffName}</strong></span>
                          <span>•</span>
                          <span>{appt.department}</span>
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B] flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#94A3B8]" />
                            {appt.email}
                          </span>
                          {appt.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#94A3B8]" />
                              {appt.phone}
                            </span>
                          )}
                        </div>

                        {appt.notes && (
                          <p className="mt-2 text-xs italic text-[#64748B] bg-[#F8FAFC] p-2 rounded border border-[#F1F5F9]">
                            "{appt.notes}"
                          </p>
                        )}
                      </div>

                      {/* Status Pill & Action Buttons */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2.5 shrink-0 self-start">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{
                            backgroundColor: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.border}`,
                          }}
                        >
                          <span>{appt.status}</span>
                        </span>

                        {appt.status === 'Scheduled' && (
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => updateStatus(appt.id, 'Completed')}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#E7F7F0] text-[#0E6E4C] hover:bg-[#D1FAE5] transition-colors"
                            >
                              Mark Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStatus(appt.id, 'Cancelled')}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#FEECEE] text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {showModal && <BookingModal onClose={() => setShowModal(false)} onBook={handleBook} />}

      {/* Floating Action Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg bg-[#0B1426] text-white text-xs sm:text-sm font-medium animate-fade-in border border-[#162238]">
          <CheckCircle2 className="w-4 h-4 text-[#16A673] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
