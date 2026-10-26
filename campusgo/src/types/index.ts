// Types for the CampusGo application

// --- FAQ Types (matches Salesforce FAQDto) ---
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  expanded?: boolean;
}

export type FAQCategory = 'All' | 'General' | 'Account' | 'Billing' | 'Technical' | 'Other';

// --- Visitor Types ---
export type VisitStatus = 'Checked In' | 'Checked Out' | 'Expected';
export type VisitPurpose = 'Meeting' | 'Interview' | 'Delivery' | 'Enquiry' | 'Other';

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  purpose: VisitPurpose;
  hostName: string;
  hostDepartment: string;
  status: VisitStatus;
  checkInTime?: string;
  checkOutTime?: string;
  date: string;
  notes?: string;
  photo?: string;
}

// --- Student Enquiry Types ---
export type EnquiryStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type EnquiryCategory = 'Admission' | 'Fee' | 'Academic' | 'Hostel' | 'Scholarship' | 'Transport' | 'Library' | 'Other';
export type EnquiryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Enquiry {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  category: EnquiryCategory;
  priority: EnquiryPriority;
  status: EnquiryStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  notes?: string;
}

// --- Appointment Types ---
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';
export type AppointmentType = 'Academic Counseling' | 'Career Guidance' | 'Fee Discussion' | 'Admission Enquiry' | 'General Meeting' | 'Other';

export interface Appointment {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  type: AppointmentType;
  staffName: string;
  department: string;
  date: string;
  time: string;
  duration: number; // minutes
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalVisitors: number;
  visitorsCheckedIn: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  totalFaqs: number;
}

// --- UI Types ---
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
