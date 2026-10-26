'use client';

import { useState } from 'react';
import {
  Settings,
  HelpCircle,
  Users,
  MessageSquare,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  ExternalLink,
  Shield,
  AlertTriangle,
  Server,
  CloudCheck,
} from 'lucide-react';
import { getFallbackFaqs } from '@/lib/admin-data';
import { formatDate } from '@/lib/utils';
import type { FAQ } from '@/types';

type AdminTab = 'overview' | 'faqs';

function AdminFaqRow({
  faq,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  faq: FAQ & { published: boolean };
  onEdit: (f: FAQ & { published: boolean }) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <tr className="hover:bg-[#F8FAFC] transition-colors">
      <td className="py-3.5 px-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-[#0B1426] line-clamp-1">{faq.question}</p>
          <p className="text-xs text-[#64748B] mt-0.5">Order sequence: #{faq.displayOrder}</p>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-[#EEF3FF] text-[#1E4BD8]">
          {faq.category}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <button
          type="button"
          onClick={() => onTogglePublish(faq.id)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
            faq.published
              ? 'bg-[#E7F7F0] text-[#0E6E4C] border border-[#16A673]/20'
              : 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]'
          }`}
        >
          {faq.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>{faq.published ? 'Live / Published' : 'Draft'}</span>
        </button>
      </td>
      <td className="py-3.5 px-4 sm:px-6 text-right">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(faq)}
            className="p-1.5 rounded-lg text-[#2B5CFF] hover:bg-[#EEF3FF] transition-colors"
            title="Edit FAQ"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {confirming ? (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onDelete(faq.id);
                  setConfirming(false);
                }}
                className="p-1.5 rounded-lg bg-[#FEECEE] text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                title="Confirm deletion"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#E5484D] hover:bg-[#FEECEE] transition-colors"
              title="Delete FAQ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function FaqEditModal({
  faq,
  onClose,
  onSave,
}: {
  faq: (FAQ & { published: boolean }) | null;
  onClose: () => void;
  onSave: (f: FAQ & { published: boolean }) => void;
}) {
  const [form, setForm] = useState({
    question: faq?.question ?? '',
    answer: faq?.answer ?? '',
    category: faq?.category ?? 'General',
    displayOrder: faq?.displayOrder ?? 1,
    published: faq?.published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave({
      id: faq?.id ?? Math.random().toString(36).slice(2),
      ...form,
      displayOrder: Number(form.displayOrder),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#0B1426]/50 backdrop-blur-xs" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-slide-right overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#EAEFF5] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-[#0B1426]">{faq ? 'Edit Knowledge Article' : 'Create Knowledge Article'}</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Campus FAQ management console</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#0B1426] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
              Question Title <span className="text-[#E5484D]">*</span>
            </label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              required
              className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
              placeholder="e.g. How do students apply for hostel room transfer?"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">
              Answer Content (HTML supported) <span className="text-[#E5484D]">*</span>
            </label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              required
              rows={5}
              className="w-full p-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all resize-none"
              placeholder="Provide the comprehensive answer..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
              >
                {['General', 'Account', 'Billing', 'Technical', 'Other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1426] mb-1.5">Display Priority</label>
              <input
                type="number"
                min={1}
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#CBD5E1] focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 outline-none transition-all"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 rounded border-[#CBD5E1] text-[#2B5CFF] focus:ring-[#2B5CFF]"
            />
            <span className="text-sm font-medium text-[#0B1426]">Publish immediately to live knowledge base</span>
          </label>

          <div className="p-3 bg-[#FEF6E7] border border-[#F59E0B]/20 rounded-lg text-xs text-[#B45309] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Changes in this session update the frontend view. To publish to production Salesforce CRM, use the connected
              Experience Cloud Admin Console.
            </span>
          </div>

          <div className="pt-4 border-t border-[#EAEFF5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#2B5CFF] hover:bg-[#1E4BD8] rounded-lg shadow-xs disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [faqs, setFaqs] = useState<(FAQ & { published: boolean })[]>(
    getFallbackFaqs().map((f) => ({ ...f, published: true }))
  );
  const [editFaq, setEditFaq] = useState<(FAQ & { published: boolean }) | null | 'new'>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveFaq = (f: FAQ & { published: boolean }) => {
    setFaqs((prev) => {
      const idx = prev.findIndex((x) => x.id === f.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = f;
        return next;
      }
      return [f, ...prev];
    });
    setEditFaq(null);
    showToast('Knowledge article saved successfully');
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    showToast('FAQ removed');
  };

  const handleTogglePublish = (id: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, published: !f.published } : f))
    );
    showToast('Publication state updated');
  };

  const publishedCount = faqs.filter((f) => f.published).length;

  return (
    <div className="space-y-6 animate-fade-in w-full min-w-0">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#EAEFF5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1426]">Administration & Control</h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E7F7F0] text-[#0E6E4C] border border-[#16A673]/20">
              Active Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configure front desk service rules, manage knowledge articles, and inspect CRM integration
          </p>
        </div>

        <a
          href="https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0B1426] hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <ExternalLink className="w-4 h-4 text-[#2B5CFF]" />
          <span>Open Salesforce Experience Console</span>
        </a>
      </div>

      {/* ================= PERMISSION & INTEGRATION CALLOUT ================= */}
      <div className="bg-[#EEF3FF] border border-[#2B5CFF]/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#2B5CFF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1E4BD8]">
          <p className="font-semibold text-sm">Enterprise Salesforce CRM Integration</p>
          <p className="mt-0.5 text-[#334155] leading-relaxed">
            CampusGo is connected to the Salesforce Lightning Platform. Front desk data is synchronized with
            Apex controllers and Custom Objects. Experience Cloud portal is live at{' '}
            <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#0B1426] border border-[#CBD5E1]">
              faqportal/admin
            </code>.
          </p>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EEF3FF] rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setTab('overview')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
            tab === 'overview'
              ? 'bg-white text-[#2B5CFF] shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1426]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>System Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('faqs')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
            tab === 'faqs'
              ? 'bg-white text-[#2B5CFF] shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1426]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Management ({faqs.length})</span>
        </button>
      </div>

      {/* ================= TAB CONTENT ================= */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Published FAQs', value: `${publishedCount} / ${faqs.length}`, sub: 'Knowledge Base Live', icon: HelpCircle, color: '#F59E0B', bg: '#FEF6E7' },
              { label: 'Total Visitors Logged', value: '142', sub: '3 on campus today', icon: Users, color: '#2B5CFF', bg: '#EEF3FF' },
              { label: 'Student Enquiries', value: '67', sub: '12 open queries', icon: MessageSquare, color: '#4F46E5', bg: '#EEF2FF' },
              { label: 'Appointments Booked', value: '89', sub: '8 upcoming slots', icon: Calendar, color: '#16A673', bg: '#E7F7F0' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl border border-[#EAEFF5] p-5 shadow-xs">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: stat.bg }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-bold text-[#0B1426] mb-0.5">{stat.value}</div>
                  <div className="text-xs font-semibold text-[#475569]">{stat.label}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">{stat.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Salesforce Org Connection Details */}
          <div className="bg-white rounded-xl border border-[#EAEFF5] p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0B1426] mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#2B5CFF]" />
              <span>Salesforce Org Architecture & Connection Endpoints</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: 'Salesforce Experience Site', url: 'https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/', status: 'Online' },
                { label: 'Public FAQ Component', url: 'https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/faq', status: 'Online' },
                { label: 'FAQ Admin LWC App', url: 'https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/admin', status: 'Secured' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-lg border border-[#EAEFF5] hover:border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0B1426] truncate">{link.label}</p>
                    <span className="text-[10px] text-[#16A673] font-semibold">{link.status}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2B5CFF] shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">
              Showing {faqs.length} articles ({publishedCount} published)
            </span>
            <button
              type="button"
              onClick={() => setEditFaq('new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B5CFF] hover:bg-[#1E4BD8] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New FAQ Article</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEFF5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#EAEFF5]">
                    <th className="py-3 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Article Question</th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Category</th>
                    <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Visibility</th>
                    <th className="py-3 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-[#64748B] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-sm">
                  {faqs.map((faq) => (
                    <AdminFaqRow
                      key={faq.id}
                      faq={faq}
                      onEdit={setEditFaq}
                      onDelete={handleDeleteFaq}
                      onTogglePublish={handleTogglePublish}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {editFaq !== null && (
        <FaqEditModal
          faq={editFaq === 'new' ? null : editFaq}
          onClose={() => setEditFaq(null)}
          onSave={handleSaveFaq}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg bg-[#0B1426] text-white text-xs sm:text-sm font-medium animate-fade-in border border-[#162238]">
          <CheckCircle2 className="w-4 h-4 text-[#16A673] shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
