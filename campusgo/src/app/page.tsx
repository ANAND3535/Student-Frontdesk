'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Calendar,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Building2,
  Clock,
  Search,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq-preview' },
  { label: 'Dashboard', href: '/dashboard' },
];

const FEATURES = [
  {
    icon: Users,
    title: 'Visitor Management',
    description:
      'Streamline check-in and check-out, track visitor purposes, and maintain complete visit histories with real-time status updates.',
    color: 'from-blue-500 to-cyan-500',
    bg: '#EFF6FF',
    href: '/visitors',
  },
  {
    icon: MessageSquare,
    title: 'Student Enquiries',
    description:
      'Centralized enquiry tracking with category management, priority assignments, and staff allocation for efficient resolution.',
    color: 'from-violet-500 to-purple-600',
    bg: '#F5F3FF',
    href: '/enquiries',
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    description:
      'Book appointments with faculty and staff, manage schedules, receive reminders, and track appointment statuses seamlessly.',
    color: 'from-emerald-500 to-teal-500',
    bg: '#ECFDF5',
    href: '/appointments',
  },
  {
    icon: HelpCircle,
    title: 'Smart FAQ System',
    description:
      'Powered by Salesforce CRM with searchable, category-filtered FAQ library serving instant answers from verified campus information.',
    color: 'from-orange-500 to-amber-500',
    bg: '#FFF7ED',
    href: '/faq',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Real-time insights on visitor traffic, enquiry resolution rates, appointment trends, and campus service utilization.',
    color: 'from-pink-500 to-rose-500',
    bg: '#FFF1F2',
    href: '/dashboard',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description:
      'Built on Salesforce with enterprise-grade security, role-based access control, and full audit trails for all campus interactions.',
    color: 'from-indigo-500 to-blue-600',
    bg: '#EEF2FF',
    href: '/dashboard',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Register or Walk In',
    description:
      'Visitors register in advance or use the front desk terminal for instant check-in with QR code generation.',
  },
  {
    step: '02',
    title: 'Instant Notifications',
    description:
      'Hosts are notified immediately. Students receive confirmation for appointments and enquiry tracking numbers.',
  },
  {
    step: '03',
    title: 'Real-Time Management',
    description:
      'Staff manage all visits, enquiries, and appointments from one unified dashboard with full visibility.',
  },
  {
    step: '04',
    title: 'Analytics & Reports',
    description:
      'Review campus service metrics, identify bottlenecks, and continuously improve the student experience.',
  },
];

const SAMPLE_FAQS_PREVIEW = [
  {
    question: 'What are the campus office hours?',
    category: 'General',
  },
  {
    question: 'How do I reset my student portal password?',
    category: 'Account',
  },
  {
    question: 'What are the accepted payment methods for fees?',
    category: 'Billing',
  },
  {
    question: 'How do I connect to campus Wi-Fi?',
    category: 'Technical',
  },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 300 && !statsAnimated) {
        setStatsAnimated(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [statsAnimated]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* ===== NAVIGATION ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
              >
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${
                  scrolled ? 'text-slate-900' : 'text-white'
                }`}
              >
                Campus<span style={{ color: '#06B6D4' }}>Go</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    scrolled
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/faq"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  scrolled
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Ask a Question
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
              >
                Open Dashboard
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link
                  href="/faq"
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Ask a Question
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 rounded-lg text-sm font-semibold text-white text-center"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero-gradient min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/20 text-white/80"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Zap className="w-4 h-4 text-cyan-400" />
                Powered by Salesforce CRM
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Smarter Campus{' '}
                  <span className="block" style={{ color: '#06B6D4' }}>
                    Services.
                  </span>
                  Seamless Every Visit.
                </h1>
                <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
                  CampusGo brings visitor management, student enquiries,
                  appointments, and campus assistance together in one intelligent
                  digital experience.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
                >
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/visitors"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border border-white/30 text-white hover:bg-white/10 transition-all"
                >
                  Register a Visit
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                {[
                  { icon: Shield, text: 'Enterprise Security' },
                  { icon: Zap, text: 'Real-time Updates' },
                  { icon: CheckCircle2, text: 'Salesforce Powered' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard preview card */}
            <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Main card */}
                <div
                  className="rounded-2xl p-6 shadow-2xl animate-float"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Campus Overview</p>
                      <h3 className="text-white font-semibold mt-1">Today&apos;s Activity</h3>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                      <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Active Visitors', value: '12', color: '#06B6D4', icon: Users },
                      { label: 'Open Enquiries', value: '8', color: '#6366F1', icon: MessageSquare },
                      { label: "Today's Appt.", value: '5', color: '#10B981', icon: Calendar },
                      { label: 'FAQs Served', value: '142', color: '#F59E0B', icon: HelpCircle },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-xl p-4"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" style={{ color }} />
                          <span className="text-white/50 text-xs">{label}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Visitor list preview */}
                  <div>
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Recent Visitors</p>
                    {['Rahul Mehta · CS Dept', 'Ananya Patel · Admissions', 'Vikram Singh · HR'].map(
                      (visitor, i) => (
                        <div
                          key={visitor}
                          className="flex items-center justify-between py-2.5 border-b last:border-0"
                          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                              style={{ background: ['#2563EB', '#6366F1', '#06B6D4'][i] }}
                            >
                              {visitor[0]}
                            </div>
                            <span className="text-white/70 text-sm">{visitor}</span>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: i === 0 ? '#10B98120' : i === 1 ? '#EF444420' : '#F59E0B20',
                              color: i === 0 ? '#10B981' : i === 1 ? '#EF4444' : '#F59E0B',
                            }}
                          >
                            {i === 0 ? 'In' : i === 1 ? 'Out' : 'Expected'}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Floating badge */}
                <div
                  className="absolute -top-4 -right-4 px-4 py-2 rounded-xl shadow-lg text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Live Data
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { value: '500+', label: 'Daily Visitors Managed' },
              { value: '99.9%', label: 'System Uptime' },
              { value: '< 30s', label: 'Average Check-In Time' },
              { value: '24/7', label: 'FAQ Availability' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
                <div className="text-white/50 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Platform Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
              Everything Your Campus Needs
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              From the moment a visitor arrives to the resolution of a student enquiry,
              CampusGo manages every interaction intelligently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group block rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: 'white',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: feature.bg }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{ stroke: `url(#grad-${feature.title.replace(/\s+/g, '-')})` }}
                  />
                  <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                      <linearGradient id={`grad-${feature.title.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={feature.color.includes('blue') ? '#3B82F6' : feature.color.includes('violet') ? '#8B5CF6' : feature.color.includes('emerald') ? '#10B981' : feature.color.includes('orange') ? '#F97316' : feature.color.includes('pink') ? '#EC4899' : '#6366F1'} />
                        <stop offset="100%" stopColor={feature.color.includes('cyan') ? '#06B6D4' : feature.color.includes('purple') ? '#9333EA' : feature.color.includes('teal') ? '#14B8A6' : feature.color.includes('amber') ? '#EAB308' : feature.color.includes('rose') ? '#F43F5E' : '#3B82F6'} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors" style={{ color: 'var(--color-text)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>
                  Explore feature <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-navy)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3 text-cyan-400">
              How CampusGo Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Simple. Fast. Intelligent.
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-white/60">
              Four steps to a fully modernized campus front desk experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.step} className="relative">
                {index < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 left-full w-full h-px z-0"
                    style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.5), transparent)' }}
                  />
                )}
                <div className="relative z-10">
                  <div
                    className="text-5xl font-black mb-4 leading-none"
                    style={{
                      background: 'linear-gradient(135deg, #2563EB, #6366F1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ PREVIEW ===== */}
      <section id="faq-preview" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Salesforce-Powered FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
              Instant Answers, Always Available
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--color-text-muted)' }}>
              Our FAQ system pulls live data from Salesforce CRM — verified, categorized,
              and searchable for students and visitors alike.
            </p>
          </div>

          {/* Search preview */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              readOnly
              className="w-full pl-12 pr-4 py-4 rounded-2xl border text-sm focus:outline-none cursor-pointer"
              style={{
                borderColor: 'var(--color-border)',
                background: 'white',
                color: 'var(--color-text)',
              }}
              onClick={() => (window.location.href = '/faq')}
            />
          </div>

          {/* FAQ list preview */}
          <div className="space-y-3 mb-8">
            {SAMPLE_FAQS_PREVIEW.map((faq) => (
              <Link
                key={faq.question}
                href="/faq"
                className="flex items-center justify-between p-5 rounded-xl border group hover:border-blue-200 hover:shadow-md transition-all"
                style={{ background: 'white', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                  >
                    {faq.category}
                  </span>
                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors" style={{ color: 'var(--color-text)' }}>
                    {faq.question}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 hover:shadow-md transition-all"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
              }}
            >
              Browse All FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0B1220 0%, #1E3A8A 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Modernize Your Campus?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Start with the CampusGo dashboard and experience how unified campus services
              can transform every interaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: 'var(--color-navy)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Campus<span style={{ color: '#06B6D4' }}>Go</span>
                </span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Smart campus front desk and visitor management powered by Salesforce CRM.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: 'Platform',
                links: [
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Visitor Management', href: '/visitors' },
                  { label: 'Student Enquiries', href: '/enquiries' },
                  { label: 'Appointments', href: '/appointments' },
                ],
              },
              {
                title: 'Help',
                links: [
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Live Site (Salesforce)', href: 'https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/' },
                  { label: 'Admin Panel', href: '/admin' },
                ],
              },
              {
                title: 'Technology',
                links: [
                  { label: 'Salesforce CRM', href: '#' },
                  { label: 'Experience Cloud', href: '#' },
                  { label: 'Lightning Web Components', href: '#' },
                  { label: 'Next.js', href: '#' },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/40 hover:text-white/80 text-sm transition-colors"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} CampusGo. Built with Salesforce CRM.
            </p>
            <div className="flex items-center gap-2 text-white/30 text-sm">
              <Clock className="w-4 h-4" />
              <span>FAQ powered by Salesforce Experience Cloud</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
