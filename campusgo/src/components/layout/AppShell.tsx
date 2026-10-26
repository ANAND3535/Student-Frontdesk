'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  HelpCircle,
  Settings,
  Menu,
  X,
  Building2,
  Bell,
  Search,
  ChevronRight,
  Home,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Visitors', href: '/visitors', icon: Users },
  { label: 'Enquiries', href: '/enquiries', icon: MessageSquare },
  { label: 'Appointments', href: '/appointments', icon: Calendar },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Admin', href: '/admin', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={sidebarCollapsed ? 'app-layout-collapsed' : 'app-layout'}>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden md:flex flex-col bg-[#0B1426] text-white border-r border-[#162238] min-h-screen z-30 select-none ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-[#162238] justify-between shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#2B5CFF] flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-bold tracking-tight text-white">Campus<span className="text-[#2B5CFF]">Go</span></span>
                <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#162238] text-[#94A3B8]">
                  DESK
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-[#64748B] hover:text-white p-1 rounded-md hover:bg-[#162238] transition-colors shrink-0"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden min-w-0">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Core Navigation
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative min-w-0 ${
                  isActive
                    ? 'bg-[#1D2B45] text-white shadow-xs'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#162238]'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#2B5CFF] rounded-r-full" />
                )}
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[#2B5CFF]' : 'text-[#64748B] group-hover:text-white'
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!sidebarCollapsed && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#64748B] shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Nav / Back to Portal */}
        <div className="p-3 border-t border-[#162238] space-y-1 shrink-0">
          <Link
            href="/"
            title={sidebarCollapsed ? 'Public Portal' : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#162238] transition-colors min-w-0 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <Home className="w-4 h-4 shrink-0 text-[#64748B]" />
            {!sidebarCollapsed && <span className="truncate">Public Portal</span>}
          </Link>
          {!sidebarCollapsed && (
            <div className="px-3 pt-2 flex items-center gap-2 text-[11px] text-[#64748B] truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A673] shrink-0" />
              <span className="truncate">Salesforce Platform Synced</span>
            </div>
          )}
        </div>
      </aside>

      {/* ================= MOBILE DRAWER BACKDROP & MENU ================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B1426]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0B1426] text-white shadow-xl animate-fade-in z-50 min-h-screen">
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-[#162238]">
              <Link
                href="/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 min-w-0"
              >
                <div className="w-9 h-9 rounded-lg bg-[#2B5CFF] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 truncate">
                  <span className="text-base font-bold text-white">Campus</span>
                  <span className="text-base font-bold text-[#2B5CFF]">Go</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#162238]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
              <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Navigation
              </div>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1D2B45] text-white'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#162238]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#2B5CFF]' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-[#162238]">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5 text-xs text-[#94A3B8] hover:text-white"
              >
                <Home className="w-4 h-4 text-[#64748B]" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* ================= MAIN APPLICATION CONTENT ================= */}
      <div className="main-layout">
        {/* Top Navigation Bar */}
        <header className="h-16 shrink-0 bg-white border-b border-[#EAEFF5] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 z-20 w-full box-border">
          {/* Left: Mobile hamburger & Search bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-[#F1F5F9] transition-colors shrink-0"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Clear, Accessible Search Input */}
            <div className="relative w-full min-w-0">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
              <input
                type="text"
                placeholder="Search visitors, enquiries, staff..."
                className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm bg-[#F8FAFC] text-[#0B1426] placeholder-[#94A3B8] rounded-lg border border-[#E2E8F0] focus:bg-white focus:outline-none focus:border-[#2B5CFF] focus:ring-2 focus:ring-[#2B5CFF]/15 transition-all box-border min-w-0"
              />
            </div>
          </div>

          {/* Right: Notifications & User profile */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Notification button */}
            <button
              type="button"
              className="relative p-2 rounded-lg text-[#475569] hover:text-[#0B1426] hover:bg-[#F1F5F9] transition-colors shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E5484D] ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-[#EAEFF5] hidden sm:block shrink-0" />

            {/* User Profile */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#2B5CFF] text-white flex items-center justify-center text-xs font-bold tracking-tight shadow-xs shrink-0">
                FD
              </div>
              <div className="hidden sm:block text-left min-w-0">
                <div className="text-xs font-semibold text-[#0B1426] truncate">Front Desk Admin</div>
                <div className="text-[11px] text-[#64748B] truncate">Main Reception</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="w-full min-w-0 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
