'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Phone,
  Mail,
  Building2,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_VISITORS } from '@/lib/data';
import { formatDate, formatTime, generateId } from '@/lib/utils';
import type { Visitor, VisitPurpose, VisitStatus } from '@/types';

const STATUS_STYLES: Record<VisitStatus, { bg: string; color: string; border: string; icon: typeof UserCheck }> = {
  'Checked In': { bg: '#E7F7F0', color: '#0E6E4C', border: 'rgba(22, 166, 115, 0.2)', icon: UserCheck },
  'Checked Out': { bg: '#EEF3FF', color: '#1E4BD8', border: 'rgba(43, 92, 255, 0.2)', icon: UserX },
  'Expected': { bg: '#FEF6E7', color: '#B45309', border: 'rgba(245, 158, 11, 0.2)', icon: Clock },
};

const PURPOSES: VisitPurpose[] = ['Meeting', 'Interview', 'Delivery', 'Enquiry', 'Other'];
const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Administration',
  'Finance Office',
  'Human Resources',
  'Facilities',
  'Admissions',
];

function RegisterModal({ onClose, onRegister }: { onClose: () => void; onRegister: (v: Visitor) => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: 'Meeting' as VisitPurpose,
    hostName: '',
    hostDepartment: 'Computer Science',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Contact number is required';
    if (!form.hostName.trim()) e.hostName = 'Host or destination is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Salesforce registration rejected');
      }
      onRegister(data.visitor);
    } catch (err) {
      setServerError((err as Error).message || 'Failed to connect to Salesforce');
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
        {/* Modal Header */}
        <div className="p-6 border-b border-[#EAEFF5] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-[#0B1426]">Register Campus Visitor</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Quick guest pass generation and gate pass log</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0B1426] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
          {serverError && (
            <div className="p-3 bg-[#FEECEE] border border-[#E5484D]/30 rounded-lg text-xs text-[#B91C1C] flex items-center gap-2">
              <span className="font-semibold">Salesforce Error:</span> {serverError}
            </div>
          )}

          {/* Visitor Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
              Visitor Full Name <span className="text-[#E5484D]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full h-10 px-3 text-sm bg-white rounded-lg border ${
                errors.name ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
              } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all`}
              placeholder="e.g. Rahul Sharma"
            />
            {errors.name && <p className="text-xs text-[#E5484D] mt-1">{errors.name}</p>}
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
                placeholder="visitor@example.com"
              />
              {errors.email && <p className="text-xs text-[#E5484D] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
                Phone Number <span className="text-[#E5484D]">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full h-10 px-3 text-sm bg-white rounded-lg border ${
                  errors.phone ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
                } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-xs text-[#E5484D] mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Purpose of Visit</label>
            <select
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value as VisitPurpose })}
              className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
            >
              {PURPOSES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Host & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
                Host / Staff Name <span className="text-[#E5484D]">*</span>
              </label>
              <input
                type="text"
                value={form.hostName}
                onChange={(e) => setForm({ ...form, hostName: e.target.value })}
                className={`w-full h-10 px-3 text-sm bg-white rounded-lg border ${
                  errors.hostName ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
                } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all`}
                placeholder="Dr. Priya Sharma"
              />
              {errors.hostName && <p className="text-xs text-[#E5484D] mt-1">{errors.hostName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Department</label>
              <select
                value={form.hostDepartment}
                onChange={(e) => setForm({ ...form, hostDepartment: e.target.value })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Additional Remarks</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full p-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all resize-none"
              placeholder="e.g. Needs guest vehicle parking pass..."
            />
          </div>

          {/* Modal Actions */}
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
              {submitting ? 'Registering...' : 'Check In Visitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>(SAMPLE_VISITORS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | VisitStatus>('All');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    async function loadSalesforceVisitors() {
      try {
        const res = await fetch('/api/visitors');
        const data = await res.json();
        if (data.success && Array.isArray(data.visitors) && data.visitors.length > 0) {
          setVisitors(data.visitors);
          setIsSynced(true);
        }
      } catch (e) {
        console.warn('Fallback to sample visitors', e);
      }
    }
    loadSalesforceVisitors();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = visitors.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.hostName.toLowerCase().includes(search.toLowerCase()) ||
      v.hostDepartment.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRegister = (v: Visitor) => {
    setVisitors((prev) => [v, ...prev]);
    setShowModal(false);
    showToast(`Visitor saved in Salesforce! Record ID: ${v.id}`, 'success');
  };

  const handleCheckOut = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: 'Checked Out' as VisitStatus, checkOutTime: new Date().toISOString() } : v
      )
    );
    showToast('Visitor marked checked out');
  };

  const checkedInCount = visitors.filter((v) => v.status === 'Checked In').length;
  const expectedCount = visitors.filter((v) => v.status === 'Expected').length;
  const checkedOutCount = visitors.filter((v) => v.status === 'Checked Out').length;

  return (
    <div className="space-y-6 animate-fade-in w-full min-w-0">
      {/* ================= HEADER & QUICK ACTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#EAEFF5]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1426]">Visitor Management</h1>
            {isSynced && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7F7F0] text-[#0E6E4C] border border-[#16A673]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A673] animate-pulse" />
                Salesforce Live Sync
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Log, track, and verify student guests, parents, and academic delegates
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2B5CFF] hover:bg-[#1E4BD8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Visitor</span>
        </button>
      </div>

      {/* ================= METRIC SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#0E6E4C]">{checkedInCount}</div>
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">Checked In Now</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#E7F7F0] flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-[#16A673]" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#B45309]">{expectedCount}</div>
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">Expected Guests</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FEF6E7] flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#F59E0B]" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#1E4BD8]">{checkedOutCount}</div>
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mt-0.5">Checked Out Today</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EEF3FF] flex items-center justify-center">
            <UserX className="w-5 h-5 text-[#2B5CFF]" />
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
            placeholder="Search by visitor name, host, or email..."
            className="w-full h-10 pl-9 pr-4 text-sm bg-white text-[#0B1426] placeholder-[#94A3B8] rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EEF3FF] rounded-lg overflow-x-auto self-start sm:self-auto">
          {(['All', 'Checked In', 'Expected', 'Checked Out'] as const).map((s) => (
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

      {/* ================= VISITORS TABLE ================= */}
      <div className="bg-white rounded-xl border border-[#EAEFF5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#EAEFF5]">
                <th className="py-3.5 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Visitor</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Contact</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Purpose</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Host & Department</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Check-In Time</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-[#64748B] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748B]">
                    <Users className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                    <p className="font-semibold text-sm text-[#0B1426]">No visitor records found</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Try refining your search keyword or active status filter</p>
                  </td>
                </tr>
              ) : (
                filtered.map((visitor) => {
                  const style = STATUS_STYLES[visitor.status];
                  const StatusIcon = style.icon;
                  return (
                    <tr key={visitor.id} className="hover:bg-[#F8FAFC] transition-colors">
                      {/* Visitor Name & Initials */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-[#EEF3FF] text-[#2B5CFF] flex items-center justify-center text-xs font-bold shrink-0">
                            {visitor.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0B1426] truncate">{visitor.name}</p>
                            <span className="text-[11px] text-[#94A3B8] font-mono">ID: {visitor.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-xs text-[#64748B]">
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-[#94A3B8] shrink-0" />
                            <span className="truncate">{visitor.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3 h-3 text-[#94A3B8] shrink-0" />
                            <span>{visitor.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Purpose */}
                      <td className="py-3.5 px-4 font-medium text-[#475569]">
                        <span className="inline-block px-2 py-0.5 bg-[#F1F5F9] text-[#334155] rounded text-xs font-medium">
                          {visitor.purpose}
                        </span>
                      </td>

                      {/* Host & Department */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <p className="font-semibold text-[#0B1426]">{visitor.hostName}</p>
                          <p className="text-[#64748B] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-[#94A3B8]" />
                            <span>{visitor.hostDepartment}</span>
                          </p>
                        </div>
                      </td>

                      {/* Check-In */}
                      <td className="py-3.5 px-4 text-xs text-[#64748B]">
                        {visitor.checkInTime ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-medium text-[#0B1426]">
                              <Clock className="w-3 h-3 text-[#94A3B8]" />
                              <span>{formatTime(visitor.checkInTime)}</span>
                            </div>
                            <div className="text-[11px] text-[#94A3B8]">{formatDate(visitor.checkInTime)}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-[#94A3B8] italic">Expected arrival</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{
                            backgroundColor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                          }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{visitor.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        {visitor.status === 'Checked In' && (
                          <button
                            type="button"
                            onClick={() => handleCheckOut(visitor.id)}
                            className="px-3 py-1 text-xs font-semibold text-[#1E4BD8] bg-[#EEF3FF] hover:bg-[#DBEAFE] rounded-md transition-colors"
                          >
                            Check Out
                          </button>
                        )}
                        {visitor.status === 'Expected' && (
                          <button
                            type="button"
                            onClick={() => {
                              setVisitors((prev) =>
                                prev.map((v) =>
                                  v.id === visitor.id
                                    ? { ...v, status: 'Checked In', checkInTime: new Date().toISOString() }
                                    : v
                                )
                              );
                              showToast(`${visitor.name} marked Checked In`);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-[#0E6E4C] bg-[#E7F7F0] hover:bg-[#D1FAE5] rounded-md transition-colors"
                          >
                            Mark Arrived
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      {showModal && <RegisterModal onClose={() => setShowModal(false)} onRegister={handleRegister} />}

      {/* Floating Action Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg bg-[#0B1426] text-white text-xs sm:text-sm font-medium animate-fade-in border border-[#162238]">
          <CheckCircle2 className="w-4 h-4 text-[#16A673] shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
