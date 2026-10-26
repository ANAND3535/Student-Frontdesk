# CampusGo Frontend

**Smarter Campus Services. Seamless Every Visit.**

CampusGo is a premium frontend for the Salesforce-backed Campus Front Desk & Visitor Management System. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form |
| Backend | Salesforce Experience Cloud + Apex |

---

## Project Structure

```
campusgo/
  src/
    app/
      page.tsx              # Landing page
      layout.tsx            # Root layout
      globals.css           # Design tokens + global styles
      dashboard/            # Main dashboard
      visitors/             # Visitor management
      enquiries/            # Student enquiries
      appointments/         # Appointment booking
      faq/                  # Salesforce-integrated FAQ
      admin/                # Administrative panel
    components/
      layout/AppShell.tsx   # Sidebar + top nav shell
    lib/
      salesforce.ts         # Salesforce FAQ integration
      data.ts               # Demo seed data
      admin-data.ts         # Admin panel data helpers
      utils.ts              # Utility functions
    types/index.ts          # TypeScript types
  .env.example              # Environment variable template
  next.config.ts            # Next.js configuration
```

---

## Pages

| Route | Description | Backend |
|---|---|---|
| `/` | Premium landing page | Static |
| `/dashboard` | Analytics dashboard | Demo data |
| `/visitors` | Visitor check-in/check-out | Demo data |
| `/enquiries` | Student enquiry tracking | Demo data |
| `/appointments` | Appointment booking | Demo data |
| `/faq` | FAQ search and browse | **Salesforce CRM** |
| `/admin` | Admin overview + FAQ management | Demo + Salesforce links |

---

## Running Locally

```powershell
cd campusgo
npm install
npm run dev
# Runs at http://localhost:3000
```

### Build for Production

```powershell
npm run build
npm start
```

---

## Salesforce Integration

### Live FAQ System
The `/faq` page integrates with Salesforce Experience Cloud:
- **Home**: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/
- **FAQ**: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/faq
- **Admin**: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/admin

`src/lib/salesforce.ts` attempts to call `FAQPublicController.getPublishedFaqs()` via the Aura endpoint. Due to browser CORS restrictions on cross-origin Aura requests, the app falls back to representative FAQ content matching the live Salesforce categories (General, Account, Billing, Technical, Other).

### Integration Status

| Feature | Status | Notes |
|---|---|---|
| FAQ data | Live Salesforce | CORS fallback active for cross-origin access |
| Visitor data | Demo | Salesforce Visitor__c object not yet created |
| Enquiry data | Demo | Salesforce Enquiry__c object not yet created |
| Appointment data | Demo | Salesforce Appointment__c object not yet created |
| Admin (FAQ) | Linked | Full CRUD on Salesforce live admin panel |

### Deploy Salesforce Backend

```powershell
sf project deploy start --source-dir ../force-app --target-org faqorg2
sf apex run test --test-level RunLocalTests --code-coverage --result-format human --wait 15 --target-org faqorg2
sf community publish --name "FAQ Portal" --target-org faqorg2
```

---

## Features Implemented

- Premium landing page with hero, features, how-it-works, FAQ preview
- Responsive collapsible sidebar dashboard with analytics charts
- Visitor check-in / check-out with full registration modal and form validation
- Student enquiry submission, tracking, and status management
- Appointment booking with staff selection and date/time picker
- FAQ with Salesforce integration, search, category filters, and accessible accordion
- Admin panel with overview stats, FAQ table management, and live Salesforce links
- Loading, empty, and error states on all pages
- Toast notifications for all user actions
- Responsive mobile layouts
- TypeScript strict mode — zero type errors
- Production build — zero errors, all 7 routes compile successfully
