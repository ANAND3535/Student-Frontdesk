'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Info,
  Tag,
  X,
  CheckCircle2,
} from 'lucide-react';
import { fetchPublishedFaqs } from '@/lib/salesforce';
import { stripHtml, debounce } from '@/lib/utils';
import type { FAQ } from '@/types';

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  All: { bg: '#EEF3FF', color: '#1E4BD8', border: 'rgba(43, 92, 255, 0.2)' },
  General: { bg: '#F1F5F9', color: '#334155', border: '#E2E8F0' },
  Account: { bg: '#E7F7F0', color: '#0E6E4C', border: 'rgba(22, 166, 115, 0.2)' },
  Billing: { bg: '#FEF6E7', color: '#B45309', border: 'rgba(245, 158, 11, 0.2)' },
  Technical: { bg: '#EEF3FF', color: '#1E4BD8', border: 'rgba(43, 92, 255, 0.2)' },
  Other: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
};

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  const catStyle = CATEGORY_COLORS[faq.category] ?? CATEGORY_COLORS.Other;

  return (
    <div
      className="bg-white rounded-xl border border-[#EAEFF5] shadow-xs hover:border-[#CBD5E1] transition-all overflow-hidden"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded"
              style={{
                backgroundColor: catStyle.bg,
                color: catStyle.color,
                border: `1px solid ${catStyle.border}`,
              }}
            >
              {faq.category}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#0B1426] group-hover:text-[#2B5CFF] transition-colors leading-snug">
            {faq.question}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 shrink-0 mt-0.5 text-[#94A3B8] transition-transform duration-200 ${
            open ? 'rotate-180 text-[#2B5CFF]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#F1F5F9] bg-[#F8FAFC]/50">
          <div
            className="text-xs sm:text-sm text-[#334155] leading-relaxed prose prose-sm max-w-none pt-2"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'salesforce' | 'fallback'>('fallback');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const debouncedSet = useCallback(
    debounce((v: unknown) => setDebouncedSearch(v as string), 250),
    []
  );

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/faq');
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setFaqs(result.data);
        setSource('salesforce');
      } else {
        const fallback = await fetchPublishedFaqs();
        setFaqs(fallback.data);
        setSource(fallback.source);
      }
    } catch {
      const fallback = await fetchPublishedFaqs();
      setFaqs(fallback.data);
      setSource(fallback.source);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const needle = debouncedSearch.toLowerCase();
    const matchSearch =
      !needle ||
      f.question.toLowerCase().includes(needle) ||
      stripHtml(f.answer).toLowerCase().includes(needle);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto w-full min-w-0">
      {/* ================= HEADER ================= */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#EEF3FF] text-[#2B5CFF] mb-3 shadow-xs">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1426]">
          Campus Knowledge & FAQ Directory
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-lg mx-auto">
          Instant answers to student queries, admissions, fee payments, and campus front desk policies
        </p>

        {/* Salesforce CRM Live Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <a
            href="https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F7F0] border border-[#16A673]/20 text-[#0E6E4C] hover:bg-[#D1FAE5] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#16A673] animate-pulse" />
            <span>Salesforce Knowledge Synchronized</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* ================= SEARCH INPUT ================= */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSet(e.target.value);
          }}
          placeholder="Search by keywords (e.g. fees, transcript, library, scholarship)..."
          className="w-full h-12 pl-11 pr-10 text-sm bg-white text-[#0B1426] placeholder-[#94A3B8] rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 transition-all shadow-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDebouncedSearch('');
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#94A3B8] hover:text-[#0B1426]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ================= CATEGORY FILTER PILLS ================= */}
      {!loading && (
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            const count = cat === 'All' ? faqs.length : faqs.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2B5CFF] text-white shadow-xs'
                    : 'bg-white text-[#475569] border border-[#CBD5E1] hover:border-[#94A3B8]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ================= FAQS ACCORDION LIST ================= */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#EAEFF5] p-5 shadow-xs animate-pulse">
              <div className="h-4 bg-[#E2E8F0] rounded w-3/4 mb-2.5" />
              <div className="h-3 bg-[#F1F5F9] rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#EAEFF5] p-12 text-center text-[#64748B] shadow-xs">
          <HelpCircle className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
          <p className="font-semibold text-sm text-[#0B1426]">No FAQ articles found</p>
          <p className="text-xs text-[#64748B] mt-0.5">Try searching with other terms or check all categories</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <FAQItem key={faq.id} faq={faq} index={i} />
          ))}
        </div>
      )}

      {/* Bottom Info Footer */}
      {!loading && (
        <div className="pt-4 border-t border-[#EAEFF5] flex items-center justify-between text-xs text-[#64748B] flex-wrap gap-2">
          <span>Displaying {filtered.length} knowledge base records</span>
          <a
            href="https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2B5CFF] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open in Salesforce Experience Cloud</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
