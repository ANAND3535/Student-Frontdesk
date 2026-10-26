'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  UserPlus,
  CalendarCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  SAMPLE_STATS,
  VISITOR_CHART_DATA,
  ENQUIRY_STATUS_DATA,
  SAMPLE_VISITORS,
  SAMPLE_APPOINTMENTS,
  SAMPLE_ENQUIRIES,
} from '@/lib/data';
import { formatDate, formatTime } from '@/lib/utils';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [pieHoverIndex, setPieHoverIndex] = useState<number | null>(null);
  const [stats, setStats] = useState(SAMPLE_STATS);
  const [visitorTrend, setVisitorTrend] = useState(VISITOR_CHART_DATA);
  const [enquiryStatusBreakdown, setEnquiryStatusBreakdown] = useState(ENQUIRY_STATUS_DATA);
  const [recentVisitors, setRecentVisitors] = useState(SAMPLE_VISITORS.slice(0, 5));
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadRealData() {
      try {
        const [statsRes, visitorsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/visitors'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success && statsData.stats) {
            setStats(statsData.stats);
            if (statsData.visitorChartData?.length > 0) {
              setVisitorTrend(statsData.visitorChartData);
            }
            if (statsData.enquiryStatusData?.length > 0) {
              setEnquiryStatusBreakdown(statsData.enquiryStatusData);
            }
            setIsSynced(true);
          }
        }

        if (visitorsRes.ok) {
          const visitorsData = await visitorsRes.json();
          if (visitorsData.success && Array.isArray(visitorsData.visitors) && visitorsData.visitors.length > 0) {
            setRecentVisitors(visitorsData.visitors.slice(0, 5));
          }
        }
      } catch (err) {
        console.warn('Dashboard fallback to sample data', err);
      }
    }
    loadRealData();
  }, []);

  const upcomingAppts = SAMPLE_APPOINTMENTS.filter((a) => a.status === 'Scheduled').slice(0, 3);
  const openEnquiries = SAMPLE_ENQUIRIES.filter((e) => e.status === 'Open' || e.status === 'In Progress').slice(0, 4);

  const STAT_CARDS = [
    {
      title: 'Total Visitors',
      value: stats.totalVisitors,
      sub: `${stats.visitorsCheckedIn} checked in now`,
      icon: Users,
      iconColor: '#2B5CFF',
      iconBg: '#EEF3FF',
      badgeText: isSynced ? 'SFDC Live' : '+12% wk',
      badgeColor: '#0E6E4C',
      badgeBg: '#E7F7F0',
      href: '/visitors',
    },
    {
      title: 'Student Enquiries',
      value: stats.totalEnquiries,
      sub: `${stats.pendingEnquiries} pending review`,
      icon: MessageSquare,
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      badgeText: isSynced ? 'SFDC Live' : '+8% wk',
      badgeColor: '#0E6E4C',
      badgeBg: '#E7F7F0',
      href: '/enquiries',
    },
    {
      title: 'Appointments',
      value: stats.totalAppointments,
      sub: `${stats.upcomingAppointments} upcoming slots`,
      icon: Calendar,
      iconColor: '#16A673',
      iconBg: '#E7F7F0',
      badgeText: isSynced ? 'SFDC Live' : '+5% wk',
      badgeColor: '#0E6E4C',
      badgeBg: '#E7F7F0',
      href: '/appointments',
    },
    {
      title: 'FAQ Entries',
      value: stats.totalFaqs,
      sub: 'Salesforce CRM Active',
      icon: HelpCircle,
      iconColor: '#F59E0B',
      iconBg: '#FEF6E7',
      badgeText: 'Live',
      badgeColor: '#1E4BD8',
      badgeBg: '#EEF3FF',
      href: '/faq',
    },
  ];

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full box-border animate-fade-in">
      {/* ================= HEADING & ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAEFF5] w-full min-w-0 box-border">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1426] truncate">
            Campus Front Desk Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span className="truncate">Visitor Management & Student Inquiries</span>
            <span className="hidden sm:inline text-[#CBD5E1]">•</span>
            <span className="font-medium text-[#475569] shrink-0">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </p>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* System Live Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#E7F7F0] border border-[#16A673]/20 text-[#0E6E4C] text-xs font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#16A673] animate-pulse shrink-0" />
            <span>{isSynced ? 'Salesforce CRM Connected' : 'System Live'}</span>
          </div>

          {/* Register Visitor Button */}
          <Link
            href="/visitors"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2B5CFF] hover:bg-[#1E4BD8] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] shrink-0 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Register Visitor</span>
          </Link>
        </div>
      </div>

      {/* ================= SUMMARY STATISTIC CARDS ================= */}
      <div className="dashboard-grid">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="dashboard-card group bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-5 shadow-xs hover:border-[#CBD5E1] hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: card.iconColor }} />
                </div>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide shrink-0 whitespace-nowrap"
                  style={{ backgroundColor: card.badgeBg, color: card.badgeColor }}
                >
                  {card.badgeText}
                </span>
              </div>

              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1426] mb-0.5">
                  {card.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#475569] truncate">
                  {card.title}
                </div>
                <div className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 truncate">
                  {card.sub}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#2B5CFF] font-medium group-hover:translate-x-0.5 transition-transform min-w-0">
                <span className="truncate">View details</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ================= CHARTS AND ANALYTICS ROW ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full min-w-0 box-border">
        {/* Visitor Activity Chart (2 Columns) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-6 shadow-xs flex flex-col justify-between min-w-0 w-full box-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 min-w-0">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#0B1426] truncate">Visitor Footfall Activity</h2>
              <p className="text-xs text-[#64748B] mt-0.5 truncate">Past 7 days campus check-in trend</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF3FF] text-[#1E4BD8] text-xs font-semibold self-start sm:self-auto shrink-0 whitespace-nowrap">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>+12% vs last week</span>
            </div>
          </div>

          <div className="w-full h-[240px] min-w-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={visitorTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2B5CFF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2B5CFF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={{ stroke: '#EAEFF5' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EAEFF5',
                      boxShadow: '0 4px 6px -1px rgba(11,20,38,0.08)',
                      fontSize: '12px',
                      color: '#0B1426',
                    }}
                    formatter={(value: any) => [`${value} Visitors`, 'Volume']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#2B5CFF"
                    strokeWidth={2.5}
                    fill="url(#visitorGradient)"
                    dot={{ fill: '#2B5CFF', strokeWidth: 0, r: 3.5 }}
                    activeDot={{ r: 5, fill: '#1E4BD8', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-[240px] flex items-center justify-center text-xs text-[#94A3B8]">
                Loading activity trend...
              </div>
            )}
          </div>
        </div>

        {/* Enquiry Status Donut Chart (1 Column) */}
        <div className="bg-white rounded-xl border border-[#EAEFF5] p-4 sm:p-6 shadow-xs flex flex-col justify-between min-w-0 w-full box-border">
          <div className="mb-3 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[#0B1426] truncate">Enquiry Status</h2>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">Distribution across enquiry queues</p>
          </div>

          <div className="w-full h-[180px] min-w-0 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={enquiryStatusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, index) => setPieHoverIndex(index)}
                    onMouseLeave={() => setPieHoverIndex(null)}
                  >
                    {enquiryStatusBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={pieHoverIndex === null || pieHoverIndex === index ? 1 : 0.6}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EAEFF5',
                      boxShadow: '0 4px 6px -1px rgba(11,20,38,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} enquiries`, 'Total']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-[180px] flex items-center justify-center text-xs text-[#94A3B8]">
                Loading distribution...
              </div>
            )}
          </div>

          {/* Status Breakdown Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1F5F9] mt-2 text-xs min-w-0">
            {enquiryStatusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#64748B] truncate text-[11px] sm:text-xs">{item.name}:</span>
                <span className="font-semibold text-[#0B1426] ml-auto shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= OPERATIONAL TABLES & STREAMS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full min-w-0 box-border">
        {/* Recent Visitors Table (2 Columns) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-[#EAEFF5] shadow-xs flex flex-col overflow-hidden min-w-0 w-full box-border">
          <div className="p-4 sm:p-5 border-b border-[#EAEFF5] flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#0B1426] truncate">Recent Campus Visitors</h2>
              <p className="text-xs text-[#64748B] truncate">Real-time desk check-ins and expected arrivals</p>
            </div>
            <Link
              href="/visitors"
              className="text-xs font-semibold text-[#2B5CFF] hover:text-[#1E4BD8] flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap"
            >
              <span>View all logs</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>

          <div className="divide-y divide-[#F1F5F9] overflow-x-auto w-full">
            {recentVisitors.map((visitor) => {
              const isCheckedIn = visitor.status === 'Checked In';
              const isCheckedOut = visitor.status === 'Checked Out';
              return (
                <div
                  key={visitor.id}
                  className="p-3.5 sm:px-5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors min-w-0 w-full"
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EEF3FF] text-[#2B5CFF] flex items-center justify-center text-xs font-bold shrink-0">
                      {visitor.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-[#0B1426] truncate">
                        {visitor.name}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#64748B] truncate">
                        {visitor.purpose} • Host: <span className="text-[#475569]">{visitor.hostName}</span> ({visitor.hostDepartment})
                      </p>
                    </div>
                  </div>

                  {/* Right: Time + Status Pill */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-xs text-[#64748B] shrink-0">
                      <Clock className="w-3 h-3 text-[#94A3B8] shrink-0" />
                      <span>{visitor.checkInTime ? formatTime(visitor.checkInTime) : 'Expected'}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                        isCheckedIn
                          ? 'bg-[#E7F7F0] text-[#0E6E4C] border border-[#16A673]/20'
                          : isCheckedOut
                          ? 'bg-[#EEF3FF] text-[#1E4BD8] border border-[#2B5CFF]/20'
                          : 'bg-[#FEF6E7] text-[#B45309] border border-[#F59E0B]/20'
                      }`}
                    >
                      {isCheckedIn && <UserCheck className="w-3 h-3 shrink-0" />}
                      {isCheckedOut && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                      {!isCheckedIn && !isCheckedOut && <Clock className="w-3 h-3 shrink-0" />}
                      <span>{visitor.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Stack: Upcoming Appointments & Open Enquiries (1 Column) */}
        <div className="space-y-6 flex flex-col justify-between min-w-0 w-full box-border">
          {/* Upcoming Appointments Card */}
          <div className="bg-white rounded-xl border border-[#EAEFF5] shadow-xs overflow-hidden flex flex-col min-w-0 w-full">
            <div className="p-3.5 sm:p-4 border-b border-[#EAEFF5] flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <CalendarCheck className="w-4 h-4 text-[#16A673] shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-[#0B1426] truncate">Upcoming Appointments</h3>
              </div>
              <Link href="/appointments" className="text-xs font-semibold text-[#2B5CFF] hover:underline shrink-0">
                View
              </Link>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {upcomingAppts.map((appt) => (
                <div key={appt.id} className="p-3 sm:p-3.5 hover:bg-[#F8FAFC] transition-colors min-w-0">
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#0B1426] truncate">{appt.studentName}</p>
                      <p className="text-[11px] text-[#64748B] truncate">{appt.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-[#EEF3FF] text-[#1E4BD8] whitespace-nowrap">
                        {appt.time}
                      </span>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5 whitespace-nowrap">{formatDate(appt.date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Enquiries Priority Card */}
          <div className="bg-white rounded-xl border border-[#EAEFF5] shadow-xs overflow-hidden flex flex-col min-w-0 w-full">
            <div className="p-3.5 sm:p-4 border-b border-[#EAEFF5] flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-[#E5484D] shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-[#0B1426] truncate">Open Enquiries Queue</h3>
              </div>
              <Link href="/enquiries" className="text-xs font-semibold text-[#2B5CFF] hover:underline shrink-0">
                View
              </Link>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {openEnquiries.map((enq) => (
                <div key={enq.id} className="p-3 sm:p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      enq.priority === 'Urgent'
                        ? 'bg-[#E5484D]'
                        : enq.priority === 'High'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#2B5CFF]'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#0B1426] truncate">{enq.subject}</p>
                    <p className="text-[10px] sm:text-[11px] text-[#64748B] truncate">{enq.studentName} • {enq.category}</p>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider shrink-0 whitespace-nowrap ${
                      enq.priority === 'Urgent'
                        ? 'bg-[#FEECEE] text-[#B91C1C]'
                        : enq.priority === 'High'
                        ? 'bg-[#FEF6E7] text-[#B45309]'
                        : 'bg-[#EEF3FF] text-[#1E4BD8]'
                    }`}
                  >
                    {enq.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
