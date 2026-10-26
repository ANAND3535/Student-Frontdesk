'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  ChevronDown,
  User,
  Tag,
  Mail,
  Phone,
} from 'lucide-react';
import { SAMPLE_ENQUIRIES } from '@/lib/data';
import { formatDate, generateId } from '@/lib/utils';
import type { Enquiry, EnquiryStatus, EnquiryCategory, EnquiryPriority } from '@/types';

const CATEGORIES: EnquiryCategory[] = [
  'Admission',
  'Fee',
  'Academic',
  'Hostel',
  'Scholarship',
  'Transport',
  'Library',
  'Other',
];

const PRIORITIES: EnquiryPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

const PRIORITY_STYLES: Record<EnquiryPriority, { bg: string; color: string; border: string }> = {
  Low: { bg: '#E7F7F0', color: '#0E6E4C', border: 'rgba(22, 166, 115, 0.2)' },
  Medium: { bg: '#EEF3FF', color: '#1E4BD8', border: 'rgba(43, 92, 255, 0.2)' },
  High: { bg: '#FEF6E7', color: '#B45309', border: 'rgba(245, 158, 11, 0.2)' },
  Urgent: { bg: '#FEECEE', color: '#B91C1C', border: 'rgba(229, 72, 77, 0.2)' },
};

const STATUS_STYLES: Record<EnquiryStatus, { bg: string; color: string; border: string; icon: typeof Clock }> = {
  Open: { bg: '#FEECEE', color: '#B91C1C', border: 'rgba(229, 72, 77, 0.2)', icon: AlertCircle },
  'In Progress': { bg: '#FEF6E7', color: '#B45309', border: 'rgba(245, 158, 11, 0.2)', icon: Clock },
  Resolved: { bg: '#E7F7F0', color: '#0E6E4C', border: 'rgba(22, 166, 115, 0.2)', icon: CheckCircle2 },
  Closed: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', icon: CheckCircle2 },
};

function NewEnquiryModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (e: Enquiry) => void }) {
  const [form, setForm] = useState({
    studentName: '',
    studentId: '',
    email: '',
    phone: '',
    subject: '',
    description: '',
    category: 'Admission' as EnquiryCategory,
    priority: 'Medium' as EnquiryPriority,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required';
    if (!form.subject.trim()) e.subject = 'Subject heading is required';
    if (form.description.trim().length < 15) e.description = 'Please provide details (minimum 15 characters)';
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
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      const enquiry: Enquiry = {
        id: data.id || generateId(),
        ...form,
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSubmit(enquiry);
    } catch {
      const enquiry: Enquiry = {
        id: generateId(),
        ...form,
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSubmit(enquiry);
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
            <h2 className="text-lg font-bold text-[#0B1426]">Log Student Enquiry</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Submit request to the administrative desk queue</p>
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
          {/* Student Name & Student ID */}
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
                placeholder="Pooja Desai"
              />
              {errors.studentName && <p className="text-xs text-[#E5484D] mt-1">{errors.studentName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Student ID (Optional)</label>
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
                placeholder="STU2024001"
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
                placeholder="student@college.edu"
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
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
              Subject / Topic <span className="text-[#E5484D]">*</span>
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={`w-full h-10 px-3 text-sm bg-white rounded-lg border ${
                errors.subject ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
              } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all`}
              placeholder="e.g. Scholarship Application Verification"
            />
            {errors.subject && <p className="text-xs text-[#E5484D] mt-1">{errors.subject}</p>}
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as EnquiryCategory })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as EnquiryPriority })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
              Detailed Description <span className="text-[#E5484D]">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className={`w-full p-3 text-sm bg-white rounded-lg border ${
                errors.description ? 'border-[#E5484D]' : 'border-[#CBD5E1]'
              } focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all resize-none`}
              placeholder="Provide complete context of the enquiry..."
            />
            {errors.description && <p className="text-xs text-[#E5484D] mt-1">{errors.description}</p>}
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
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(SAMPLE_ENQUIRIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EnquiryStatus>('All');
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    async function loadEnquiries() {
      try {
        const res = await fetch('/api/enquiries');
        const data = await res.json();
        if (data.success && Array.isArray(data.enquiries) && data.enquiries.length > 0) {
          setEnquiries(data.enquiries);
          setIsSynced(true);
        }
      } catch (e) {
        console.warn('Fallback to sample enquiries', e);
      }
    }
    loadEnquiries();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = enquiries.filter(
    (e) =>
      (statusFilter === 'All' || e.status === statusFilter) &&
      (e.studentName.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = (e: Enquiry) => {
    setEnquiries((prev) => [e, ...prev]);
    setShowModal(false);
    showToast(`Enquiry logged successfully: ENQ-${e.id.slice(0, 6).toUpperCase()}`);
  };

  const updateStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e))
    );
    showToast(`Enquiry updated to ${status}`);
  };

  return (
    <div className="space-y-6 animate-fade-in w-full min-w-0">
      {/* ================= HEADER & QUICK ACTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#EAEFF5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1426]">Student Enquiries Desk</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Track, prioritize, and resolve student queries, fees, scholarships, and academic requests
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2B5CFF] hover:bg-[#1E4BD8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Enquiry</span>
        </button>
      </div>

      {/* ================= STATUS SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['Open', 'In Progress', 'Resolved', 'Closed'] as EnquiryStatus[]).map((s) => {
          const style = STATUS_STYLES[s];
          const Icon = style.icon;
          const count = enquiries.filter((e) => e.status === s).length;
          const isSelected = statusFilter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`rounded-xl p-4 border text-left transition-all ${
                isSelected
                  ? 'bg-white border-[#2B5CFF] ring-2 ring-[#2B5CFF]/15 shadow-sm'
                  : 'bg-white border-[#EAEFF5] hover:border-[#CBD5E1] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: style.color }}>
                  {s}
                </span>
                <Icon className="w-4 h-4" style={{ color: style.color }} />
              </div>
              <div className="text-2xl font-bold text-[#0B1426]">{count}</div>
            </button>
          );
        })}
      </div>

      {/* ================= SEARCH & STATUS FILTER ================= */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by subject, student, or category..."
            className="w-full h-10 pl-9 pr-4 text-sm bg-white text-[#0B1426] placeholder-[#94A3B8] rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EEF3FF] rounded-lg overflow-x-auto self-start sm:self-auto">
          {(['All', 'Open', 'In Progress', 'Resolved', 'Closed'] as const).map((s) => (
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

      {/* ================= ENQUIRIES LIST ================= */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#EAEFF5] p-12 text-center text-[#64748B] shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[#0B1426]">No enquiries match your query</p>
            <p className="text-xs text-[#64748B] mt-0.5">Try searching with a different term or reset your status filter</p>
          </div>
        ) : (
          filtered.map((enquiry) => {
            const statusStyle = STATUS_STYLES[enquiry.status];
            const priorityStyle = PRIORITY_STYLES[enquiry.priority];
            const StatusIcon = statusStyle.icon;
            const isExpanded = expandedId === enquiry.id;

            return (
              <div
                key={enquiry.id}
                className="bg-white rounded-xl border border-[#EAEFF5] shadow-xs hover:border-[#CBD5E1] transition-all overflow-hidden"
              >
                {/* Collapsible Card Header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : enquiry.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {/* Priority pill */}
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.color,
                          border: `1px solid ${priorityStyle.border}`,
                        }}
                      >
                        {enquiry.priority}
                      </span>

                      {/* Category tag */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                        {enquiry.category}
                      </span>

                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        #{enquiry.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#0B1426] truncate">{enquiry.subject}</h3>

                    <p className="text-xs text-[#64748B] mt-1 truncate">
                      Student: <span className="font-semibold text-[#475569]">{enquiry.studentName}</span>
                      {enquiry.studentId && ` (${enquiry.studentId})`} • Logged: {formatDate(enquiry.createdAt)}
                    </p>
                  </div>

                  {/* Status & Toggle Arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                      }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{enquiry.status}</span>
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Card Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                        Detailed Description
                      </h4>
                      <p className="text-xs sm:text-sm text-[#0B1426] leading-relaxed bg-white p-3 rounded-lg border border-[#EAEFF5]">
                        {enquiry.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] pt-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>{enquiry.email}</span>
                        </span>
                        {enquiry.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>{enquiry.phone}</span>
                          </span>
                        )}
                        {enquiry.assignedTo && (
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>Assigned: <strong className="text-[#0B1426]">{enquiry.assignedTo}</strong></span>
                          </span>
                        )}
                      </div>

                      {/* Quick Status State Switchers */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-medium text-[#64748B] mr-1">Move Status:</span>
                        {(['Open', 'In Progress', 'Resolved', 'Closed'] as EnquiryStatus[]).map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={enquiry.status === s}
                            onClick={() => updateStatus(enquiry.id, s)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white bg-white text-[#475569] border-[#CBD5E1]"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Enquiry Modal */}
      {showModal && <NewEnquiryModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}

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
