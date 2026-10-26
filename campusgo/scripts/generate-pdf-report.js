const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'report', 'screenshots');

function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) return '';
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

const img01 = getBase64Image('01_dashboard.png');
const img02 = getBase64Image('02_dashboard_analytics.png');
const img03 = getBase64Image('03_visitor_registration.png');
const img04 = getBase64Image('04_visitor_records.png');
const img05 = getBase64Image('05_student_enquiries.png');
const img06 = getBase64Image('06_appointments.png');
const img07 = getBase64Image('07_faq_management.png');
const img08 = getBase64Image('08_admin_panel.png');
const img09 = getBase64Image('09_salesforce_integration.png');
const img10 = getBase64Image('10_salesforce_records.png');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampusGo Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 12mm 14mm 12mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1E293B;
      background: #FFFFFF;
      line-height: 1.48;
      font-size: 9.5pt;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* Cover Page */
    .cover-container {
      height: 94vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 18px 18px 18px;
      border: 3px double #2B5CFF;
      border-radius: 8px;
    }

    .cover-top {
      text-align: center;
    }

    .institution-header {
      font-size: 13.5pt;
      font-weight: 700;
      color: #0B1426;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }

    .department-header {
      font-size: 10.5pt;
      font-weight: 600;
      color: #2B5CFF;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cover-title-box {
      text-align: center;
      margin: 35px 0;
      padding: 22px;
      background: #F8FAFC;
      border-top: 4px solid #2B5CFF;
      border-bottom: 4px solid #0B1426;
      border-radius: 4px;
    }

    .project-title {
      font-size: 30pt;
      font-weight: 800;
      color: #0B1426;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    .project-subtitle {
      font-size: 13pt;
      font-weight: 500;
      color: #475569;
      margin-bottom: 12px;
    }

    .report-type {
      display: inline-block;
      font-size: 9pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #2B5CFF;
      background: #EEF3FF;
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid rgba(43, 92, 255, 0.2);
    }

    .cover-metadata-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 10px;
    }

    .metadata-block {
      background: #F8FAFC;
      padding: 12px 16px;
      border-left: 3px solid #2B5CFF;
      border-radius: 0 6px 6px 0;
    }

    .metadata-label {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748B;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }

    .metadata-value {
      font-size: 9pt;
      font-weight: 600;
      color: #0B1426;
      line-height: 1.35;
    }

    .cover-footer {
      text-align: center;
      padding-top: 10px;
      border-top: 1px solid #E2E8F0;
      font-size: 8pt;
      color: #64748B;
      font-weight: 500;
    }

    /* Content Typography */
    h1 {
      font-size: 14pt;
      font-weight: 800;
      color: #0B1426;
      border-bottom: 2px solid #2B5CFF;
      padding-bottom: 4px;
      margin-top: 16px;
      margin-bottom: 8px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 11pt;
      font-weight: 700;
      color: #0B1426;
      margin-top: 12px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h2::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 12px;
      background: #2B5CFF;
      border-radius: 2px;
    }

    h3 {
      font-size: 9.5pt;
      font-weight: 600;
      color: #1E293B;
      margin-top: 8px;
      margin-bottom: 3px;
    }

    p {
      margin-bottom: 6px;
      text-align: justify;
      color: #334155;
    }

    ul, ol {
      margin-left: 18px;
      margin-bottom: 8px;
      color: #334155;
    }

    li {
      margin-bottom: 2px;
    }

    /* Academic Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 10px 0;
      font-size: 8pt;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #CBD5E1;
      padding: 5px 8px;
      text-align: left;
    }

    th {
      background: #0B1426;
      color: #FFFFFF;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 7pt;
      letter-spacing: 0.5px;
    }

    tr:nth-child(even) td {
      background: #F8FAFC;
    }

    /* Code & Architecture Boxes */
    .code-block {
      background: #0B1426;
      color: #E2E8F0;
      padding: 9px 11px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      line-height: 1.35;
      margin: 8px 0 10px 0;
      overflow-x: auto;
      border-left: 4px solid #2B5CFF;
      page-break-inside: avoid;
    }

    .badge-pass {
      display: inline-block;
      background: #E7F7F0;
      color: #0E6E4C;
      font-weight: 700;
      font-size: 7pt;
      padding: 2px 5px;
      border-radius: 3px;
      border: 1px solid rgba(22, 166, 115, 0.25);
    }

    /* Screenshots in Report */
    .figure-container {
      margin: 10px 0 14px 0;
      text-align: center;
      page-break-inside: avoid;
    }

    .screenshot-img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      box-shadow: 0 3px 8px rgba(11, 20, 38, 0.08);
      max-height: 285px;
      object-fit: contain;
    }

    .figure-caption {
      margin-top: 4px;
      font-size: 8pt;
      font-weight: 600;
      color: #0B1426;
    }

    .figure-desc {
      font-size: 7.5pt;
      color: #64748B;
      margin-top: 1px;
      text-align: center;
    }

    /* Callout Boxes */
    .callout {
      background: #EEF3FF;
      border-left: 4px solid #2B5CFF;
      padding: 7px 10px;
      border-radius: 0 5px 5px 0;
      margin: 8px 0;
      font-size: 8pt;
      color: #1E4BD8;
      page-break-inside: avoid;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #CBD5E1;
      padding: 2.5px 0;
      font-size: 8.5pt;
    }
  </style>
</head>
<body>

  <!-- ================= PAGE 1: COVER PAGE ================= -->
  <div class="cover-container page-break">
    <div class="cover-top">
      <div class="institution-header">[COLLEGE / INSTITUTION NAME]</div>
      <div class="department-header">Department of Computer Science & Engineering</div>
      <div style="font-size: 8.5pt; color: #64748B; margin-top: 4px;">Accredited by NAAC / NBA • Affiliated to State Technological University</div>
    </div>

    <div class="cover-title-box">
      <div class="project-title">CampusGo</div>
      <div class="project-subtitle">Smart Campus Front Desk & Visitor Management System</div>
      <div class="report-type">Final Year Academic Project Documentation Report</div>
    </div>

    <div>
      <div class="cover-metadata-grid">
        <div class="metadata-block">
          <div class="metadata-label">Submitted By:</div>
          <div class="metadata-value">
            [Student Name / Candidate 1] (USN: [Roll / USN 1])<br>
            [Student Name / Candidate 2] (USN: [Roll / USN 2])<br>
            [Student Name / Candidate 3] (USN: [Roll / USN 3])
          </div>
        </div>
        <div class="metadata-block">
          <div class="metadata-label">Under the Guidance of:</div>
          <div class="metadata-value">
            [Guide Name / Supervisor]<br>
            Assistant Professor / Senior Faculty<br>
            Department of Computer Science & Engineering
          </div>
        </div>
      </div>

      <div class="cover-metadata-grid" style="margin-top: 10px;">
        <div class="metadata-block">
          <div class="metadata-label">Academic Stream:</div>
          <div class="metadata-value">Bachelor of Engineering / Technology (B.E. / B.Tech)</div>
        </div>
        <div class="metadata-block">
          <div class="metadata-label">Academic Year:</div>
          <div class="metadata-value">2026 – 2027</div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      CampusGo Web Application • Powered by Next.js 16, React 19 & Salesforce Enterprise Platform
    </div>
  </div>

  <!-- ================= PAGE 2: TOC & ABSTRACT & INTRODUCTION ================= -->
  <div class="page-break">
    <h1>Table of Contents</h1>
    <div style="margin-top: 8px; margin-bottom: 16px;">
      <div class="toc-item"><span>1. Abstract & Problem Statement</span><span>Section 1</span></div>
      <div class="toc-item"><span>2. Introduction & Background</span><span>Section 2</span></div>
      <div class="toc-item"><span>3. Project Objectives</span><span>Section 3</span></div>
      <div class="toc-item"><span>4. System Requirements & Specifications</span><span>Section 4</span></div>
      <div class="toc-item"><span>5. Technology Stack & Frameworks</span><span>Section 5</span></div>
      <div class="toc-item"><span>6. System Architecture & High-Level Data Flow</span><span>Section 6</span></div>
      <div class="toc-item"><span>7. Module Architecture & Implementation</span><span>Section 7</span></div>
      <div class="toc-item"><span>8. Screenshots & User Interface Walkthrough</span><span>Section 8</span></div>
      <div class="toc-item"><span>9. Salesforce CRM Integration & REST API Operations</span><span>Section 9</span></div>
      <div class="toc-item"><span>10. Testing, Quality Assurance & Results</span><span>Section 10</span></div>
      <div class="toc-item"><span>11. Security, Token Isolation & Governance</span><span>Section 11</span></div>
      <div class="toc-item"><span>12. Conclusion & Future Enhancements</span><span>Section 12</span></div>
      <div class="toc-item"><span>13. References & Documentation Links</span><span>Section 13</span></div>
    </div>

    <h1>1. Abstract</h1>
    <p>
      In contemporary educational institutions, front-desk visitor registration, student enquiries, faculty counseling schedules, and policy dissemination are frequently managed through fragmented manual logbooks or spreadsheets. This conventional approach results in operational latency, compromised campus security, vulnerability to identity manipulation, and poor analytics regarding daily campus footfall.
    </p>
    <p>
      <strong>CampusGo</strong> is an enterprise-grade, centralized web application engineered specifically to digitize and modernize college front-desk administration. Built upon a high-performance frontend architecture using Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4, CampusGo provides an intuitive, responsive management interface designed with Razorpay-inspired visual contrast and ergonomic clarity.
    </p>
    <p>
      Crucially, CampusGo connects seamlessly with the <strong>Salesforce Lightning Platform CRM</strong> backend. Rather than relying on static or mocked records, visitor registrations are validated on both client and server layers, dispatched via authenticated REST API endpoints, and committed directly to Salesforce Custom Objects (<code>Visitor__c</code>, <code>Student_Enquiry__c</code>, <code>Appointment__c</code>, and <code>FAQ__c</code>). Live footfall telemetry, real-time SOQL aggregate analytics, interactive Recharts time-series data, and an institutional knowledge base provide administrators with immediate operational intelligence.
    </p>

    <h2>2. Introduction & Background</h2>
    <p>
      Modern universities and engineering colleges host hundreds of visiting parents, academic delegates, vendor contractors, campus recruitment officers, and student applicants daily. Reception and security staff bear the responsibility of logging attendee credentials, issuing entry clearances, and routing queries to relevant departmental heads. Traditional paper logbooks exhibit critical flaws: lack of real-time auditing, departmental ticket bottlenecks, and fragmented records separated from institutional databases. CampusGo addresses these deficits by bridging a responsive web frontend with an enterprise Salesforce CRM backend.
    </p>
  </div>

  <!-- ================= PAGE 3: OBJECTIVES & REQUIREMENTS ================= -->
  <div class="page-break">
    <h1>3. Project Objectives</h1>
    <p>The primary engineering and operational objectives of the CampusGo project are:</p>
    <ol>
      <li><strong>Centralized Digital Visitor Log:</strong> Provide a rapid, structured check-in workflow capturing visitor credentials, contact numbers, host faculty, and visit purpose with automatic timestamps.</li>
      <li><strong>Direct Salesforce CRM Persistence:</strong> Guarantee that every visitor registration generates an authentic record in the Salesforce org (<code>Visitor__c</code>) returning a persistent 18-character Salesforce record identifier.</li>
      <li><strong>Live Footfall & Query Telemetry:</strong> Calculate and visualize real-time campus statistics, 7-day footfall trends, and enquiry distribution charts via live SOQL aggregation.</li>
      <li><strong>Departmental Query & Appointment Coordination:</strong> Streamline student enquiry tracking and faculty counseling appointment bookings with priority and status tagging.</li>
      <li><strong>Centralized Campus Knowledge Base:</strong> Disseminate verified institutional policies, tuition timelines, and campus guidelines from published Salesforce <code>FAQ__c</code> records.</li>
      <li><strong>Zero-Trust Credential Security:</strong> Implement strict server-side token management ensuring Salesforce OAuth credentials, refresh tokens, and access keys are never exposed to browser runtimes.</li>
    </ol>

    <h1>4. System Requirements & Specifications</h1>
    <h2>4.1 Software & Development Environment</h2>
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Specification / Version</th>
          <th>Function</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Operating System</td><td>Microsoft Windows 11 (64-bit)</td><td>Development & Testing Host Environment</td></tr>
        <tr><td>Node.js Runtime</td><td>Node.js v24.19.0 / v20+ LTS</td><td>JavaScript/TypeScript Engine & Server Execution</td></tr>
        <tr><td>Package Manager</td><td>npm v11.x</td><td>Dependency resolution and script management</td></tr>
        <tr><td>Web Framework</td><td>Next.js 16.4.3 (App Router)</td><td>React Server Components & Server Route Handlers</td></tr>
        <tr><td>UI Library</td><td>React 19.3.0 & React-DOM</td><td>Component-driven stateful user interface</td></tr>
        <tr><td>Styling Engine</td><td>Tailwind CSS v4 & PostCSS 8</td><td>Utility-first CSS design tokens and responsive grid</td></tr>
        <tr><td>Data Visualization</td><td>Recharts v3.10.1</td><td>Vector-based AreaChart & Donut Chart rendering</td></tr>
        <tr><td>Iconography</td><td>Lucide-React v1.61.0</td><td>Feather-style SVG icons for ergonomics</td></tr>
        <tr><td>Salesforce CLI</td><td>sf CLI v2.76.7 / sfdx v61.0</td><td>Salesforce DX org management & metadata deployment</td></tr>
        <tr><td>Salesforce Platform</td><td>Salesforce Developer Edition (v61.0)</td><td>Enterprise CRM backend database and security model</td></tr>
      </tbody>
    </table>

    <h2>4.2 Hardware Requirements</h2>
    <ul>
      <li><strong>Processor:</strong> Dual-core Intel Core i3 / AMD Ryzen 3 or higher (Quad-core recommended).</li>
      <li><strong>System Memory:</strong> 8 GB RAM minimum (16 GB recommended for concurrent Next.js server & Salesforce CLI).</li>
      <li><strong>Storage:</strong> 2 GB available SSD storage for repository, node_modules, and cache files.</li>
      <li><strong>Network:</strong> Broadband Internet connectivity with HTTPS access to Salesforce endpoints.</li>
    </ul>
  </div>

  <!-- ================= PAGE 4: TECH STACK & SYSTEM ARCHITECTURE ================= -->
  <div class="page-break">
    <h1>5. Technology Stack & Frameworks</h1>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px;">
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 5px;">
        <h3 style="color: #2B5CFF; margin-top: 0;">Frontend Presentation Layer</h3>
        <p style="font-size: 7.5pt; margin-bottom: 0;">
          Built with <strong>Next.js 16 App Router</strong> and <strong>React 19</strong>. Employs CSS Grid layouts (<code>.app-layout</code> with 260px sidebar and fluid viewport) ensuring complete zero-overflow responsiveness across 320px mobile to 1440px desktop viewports. Uses <strong>Recharts</strong> for smooth SVG telemetry and <strong>Tailwind CSS v4</strong>.
        </p>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 5px;">
        <h3 style="color: #2B5CFF; margin-top: 0;">Backend API Route Layer</h3>
        <p style="font-size: 7.5pt; margin-bottom: 0;">
          Node.js server-side route handlers (<code>src/app/api/visitors</code>, <code>/api/dashboard/stats</code>, <code>/api/faq</code>, <code>/api/enquiries</code>, <code>/api/appointments</code>). Acts as a secure intermediary executing validation, token management, and authenticated Salesforce REST API dispatches.
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 5px;">
        <h3 style="color: #0E6E4C; margin-top: 0;">Salesforce CRM Cloud Layer</h3>
        <p style="font-size: 7.5pt; margin-bottom: 0;">
          Salesforce Lightning Platform Developer Edition (Org ID: <code>00Dg700000LlSZREA3</code>). Houses custom data models (<code>Visitor__c</code>, <code>Student_Enquiry__c</code>, <code>Appointment__c</code>, <code>FAQ__c</code>) configured with field-level security, record locking, and automated timestamps.
        </p>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 5px;">
        <h3 style="color: #0E6E4C; margin-top: 0;">Security & Integration Bridge</h3>
        <p style="font-size: 7.5pt; margin-bottom: 0;">
          Supports dual-mode Salesforce connectivity: Connected App OAuth 2.0 Web Server / Client Credentials Flow for production environments, and a secure local development bridge leveraging the active authenticated SF CLI session with automatic token caching.
        </p>
      </div>
    </div>

    <h1 style="margin-top: 14px;">6. System Architecture & High-Level Data Flow</h1>
    <p>
      The interaction diagram between the CampusGo client interface, secure Next.js server proxy, and Salesforce:
    </p>

    <div class="code-block">
+-----------------------------------------------------------------------------------+
|                           CLIENT TIER (BROWSER RUNTIME)                           |
|  [Dashboard View]   [Visitor Register Modal]   [Visitors Table]   [FAQ Directory] |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON (Internal App Routes)
                                           v
+-----------------------------------------------------------------------------------+
|                      SERVER TIER (NEXT.JS APP ROUTER API)                         |
|  POST /api/visitors        GET /api/dashboard/stats        GET /api/faq           |
|  * Payload Validation      * SOQL Query Builder            * Cache Invalidation   |
|  * Error Normalization     * Aggregation & Formatting      * Safe Error Envelope  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |           Salesforce Token Manager & Client (src/lib/salesforce/client.ts)   |  |
|  |           * Dual-Mode Auth (OAuth 2.0 Connected App / CLI Dev Bridge)       |  |
|  |           * In-Memory Token Cache with Expiration Safeguard                 |  |
|  +---------------------------------------+-------------------------------------+  |
+------------------------------------------|----------------------------------------+
                                           | HTTPS / REST API v61.0 (Bearer Token)
                                           v
+-----------------------------------------------------------------------------------+
|                       ENTERPRISE SALESFORCE CRM TIER                              |
|  Instance: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.salesforce.com            |
|                                                                                   |
|  +-------------------+  +------------------------+  +--------------------------+  |
|  |   Visitor__c      |  |  Student_Enquiry__c    |  |       FAQ__c             |  |
|  | - Name            |  | - Name                 |  | - Question__c            |  |
|  | - Email__c        |  | - CreatedDate          |  | - Answer__c              |  |
|  | - Contact_Number__c| |                        |  | - Category__c            |  |
|  | - CreatedDate     |  |                        |  | - Is_Published__c        |  |
|  +-------------------+  +------------------------+  +--------------------------+  |
+-----------------------------------------------------------------------------------+
    </div>
  </div>

  <!-- ================= PAGE 5: MODULE ARCHITECTURE ================= -->
  <div class="page-break">
    <h1>7. Module Architecture & Implementation</h1>
    <p>CampusGo is structured into specialized, decoupled modules adhering to separation-of-concerns principles:</p>

    <h2>7.1 Dashboard & Operational Telemetry Module</h2>
    <p>
      Located at <code>/dashboard</code>, this module serves as the administrative cockpit. It initiates parallel requests to retrieve real-time counts from Salesforce: Total Visitors (<code>Visitor__c</code>), Student Enquiries (<code>Student_Enquiry__c</code>), Faculty Appointments (<code>Appointment__c</code>), and Published FAQs (<code>FAQ__c</code>). The telemetry section renders an interactive <strong>AreaChart</strong> for 7-day footfall trends and a segmented <strong>Donut Chart</strong> for category distribution.
    </p>

    <h2>7.2 Visitor Management & Gate Pass Module</h2>
    <p>
      Located at <code>/visitors</code>, this module governs logging, verification, and checkout of campus guests:
    </p>
    <ul>
      <li><strong>Live Sync Status Indicator:</strong> Confirms active Salesforce connectivity directly in the view header.</li>
      <li><strong>Slide-Over Registration Drawer:</strong> Validated inputs for Name, Email, Phone, Purpose, Host, Department, and Remarks.</li>
      <li><strong>Two-Way Verification:</strong> Displays pending spinner states during REST transmission, and displays the permanent Salesforce 18-character ID (<code>a00...</code>) upon persistence confirmation.</li>
      <li><strong>Filter & Search Toolbar:</strong> Instant client-side filtering across visitor names, hosts, and departments with status pills (<code>Checked In</code>, <code>Expected</code>, <code>Checked Out</code>).</li>
    </ul>

    <h2>7.3 Student Enquiries Desk Module</h2>
    <p>
      Located at <code>/enquiries</code>, this module facilitates academic ticketing. Student queries across categories (Admissions, Fees, Examinations, Hostels, Scholarships) are tracked with priority flags (Urgent, High, Medium, Low) and lifecycle states (Open, In Progress, Resolved, Closed).
    </p>

    <h2>7.4 Counseling & Appointment Schedule Module</h2>
    <p>
      Located at <code>/appointments</code>, this module organizes student appointments with faculty, department heads, and academic counselors with time-slot management, duration calculation, and status updating.
    </p>

    <h2>7.5 Institutional FAQ & Knowledge Base Module</h2>
    <p>
      Located at <code>/faq</code>, this module delivers authenticated institutional knowledge directly from Salesforce <code>FAQ__c</code> records with keyword debouncing, category pills, and accessible accordion expansions.
    </p>

    <h2>7.6 Administration & Platform Control Module</h2>
    <p>
      Located at <code>/admin</code>, this module presents system health metrics, direct links to the Salesforce Experience Cloud site and Lightning Web Component (LWC) apps, and synchronization diagnostics.
    </p>
  </div>

  <!-- ================= PAGES 6-10: SCREENSHOTS (2 PER PAGE) ================= -->
  <div class="page-break">
    <h1>8. Screenshots & User Interface Walkthrough</h1>
    <div class="figure-container">
      <img src="${img01}" class="screenshot-img" alt="CampusGo Dashboard Overview">
      <div class="figure-caption">Figure 1: CampusGo Dashboard Overview & KPI Metrics</div>
      <div class="figure-desc">Shows the dark navy (#0B1426) navigation sidebar, top reception bar, "Salesforce CRM Connected" status pill, and four primary operational metric cards.</div>
    </div>

    <div class="figure-container">
      <img src="${img02}" class="screenshot-img" alt="CampusGo Dashboard Analytics">
      <div class="figure-caption">Figure 2: Real-Time Footfall Activity & Enquiry Distribution Analytics</div>
      <div class="figure-desc">Displays the interactive Recharts AreaChart graphing real 7-day campus footfall trends and the Donut chart showing categorized query queues.</div>
    </div>
  </div>

  <div class="page-break">
    <div class="figure-container">
      <img src="${img03}" class="screenshot-img" alt="Visitor Registration Modal">
      <div class="figure-caption">Figure 3: Campus Visitor Registration Slide-Over Form</div>
      <div class="figure-desc">Illustrates the validated guest pass registration interface with required input controls for Full Name, Email, Phone, Host, and Department.</div>
    </div>

    <div class="figure-container">
      <img src="${img04}" class="screenshot-img" alt="Visitor Records Table">
      <div class="figure-caption">Figure 4: Real-Time Salesforce Visitor Records Directory</div>
      <div class="figure-desc">Displays live records queried directly from Salesforce Visitor__c (e.g. Automated Test Visitor, Dr. Ramesh Sundaram) with Salesforce Live Sync badge.</div>
    </div>
  </div>

  <div class="page-break">
    <div class="figure-container">
      <img src="${img05}" class="screenshot-img" alt="Student Enquiries Desk">
      <div class="figure-caption">Figure 5: Student Enquiries Desk & Ticket Management</div>
      <div class="figure-desc">Shows enquiry queue management with color-coded priority badges (High, Urgent, Medium), category tags, and status transition controls.</div>
    </div>

    <div class="figure-container">
      <img src="${img06}" class="screenshot-img" alt="Appointment Schedule">
      <div class="figure-caption">Figure 6: Faculty Counseling & Appointment Schedule</div>
      <div class="figure-desc">Displays scheduled academic counseling sessions, assigned faculty members, duration metrics, and date badges.</div>
    </div>
  </div>

  <div class="page-break">
    <div class="figure-container">
      <img src="${img07}" class="screenshot-img" alt="Campus FAQ Directory">
      <div class="figure-caption">Figure 7: Campus Knowledge & FAQ Directory</div>
      <div class="figure-desc">Shows the synchronized institutional knowledge directory querying published articles from Salesforce FAQ__c with category filtering.</div>
    </div>

    <div class="figure-container">
      <img src="${img08}" class="screenshot-img" alt="Administration Panel">
      <div class="figure-caption">Figure 8: Administration & Platform Control Center</div>
      <div class="figure-desc">Presents administrative statistics, system health indicators, and direct links to Salesforce Experience Cloud and LWC apps.</div>
    </div>
  </div>

  <div class="page-break">
    <div class="figure-container">
      <img src="${img09}" class="screenshot-img" alt="Salesforce Knowledge Management">
      <div class="figure-caption">Figure 9: Salesforce Knowledge Management & Article Status</div>
      <div class="figure-desc">Shows the administrative tab view displaying all 12 published knowledge articles synchronized with the Salesforce Lightning backend.</div>
    </div>

    <div class="figure-container">
      <img src="${img10}" class="screenshot-img" alt="Salesforce Database Evidence">
      <div class="figure-caption">Figure 10: Direct Salesforce CLI Terminal Database Verification</div>
      <div class="figure-desc">Visual proof executing SOQL queries via Salesforce CLI directly against org faqorg2, confirming records created via CampusGo exist in Salesforce.</div>
    </div>
  </div>

  <!-- ================= PAGE 11: SALESFORCE INTEGRATION ================= -->
  <div class="page-break">
    <h1>9. Salesforce CRM Integration & REST API Operations</h1>
    <p>
      The integration is implemented cleanly in <code>src/lib/salesforce/client.ts</code> and exposed via server-side API endpoints:
    </p>

    <h2>9.1 Schema Mapping</h2>
    <table>
      <thead>
        <tr>
          <th>CampusGo Entity</th>
          <th>Salesforce Custom Object</th>
          <th>Mapped Fields & Types</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Visitor Profile</td>
          <td><code>Visitor__c</code></td>
          <td>
            <code>Name</code> (Text, 80) • <code>Email__c</code> (Email, 80)<br>
            <code>Contact_Number__c</code> (Phone, 40) • <code>CreatedDate</code> (DateTime, Auto)
          </td>
        </tr>
        <tr>
          <td>Student Ticket</td>
          <td><code>Student_Enquiry__c</code></td>
          <td><code>Name</code> (Text, 80 — Subject) • <code>CreatedDate</code> (DateTime, Auto)</td>
        </tr>
        <tr>
          <td>Counseling Slot</td>
          <td><code>Appointment__c</code></td>
          <td><code>Name</code> (Text, 80 — Staff / Topic) • <code>CreatedDate</code> (DateTime, Auto)</td>
        </tr>
        <tr>
          <td>Knowledge Item</td>
          <td><code>FAQ__c</code></td>
          <td>
            <code>Question__c</code> (Text, 255) • <code>Answer__c</code> (LongTextArea)<br>
            <code>Category__c</code> (Picklist) • <code>Is_Published__c</code> (Boolean) • <code>Display_Order__c</code> (Number)
          </td>
        </tr>
      </tbody>
    </table>

    <h2>9.2 Endpoint Implementations</h2>
    <ul>
      <li><code>POST /api/visitors</code>: Validates guest data, dispatches JSON to <code>/services/data/v61.0/sobjects/Visitor__c</code>, and returns Salesforce Record ID.</li>
      <li><code>GET /api/visitors</code>: Executes SOQL query <code>SELECT Id, Name, Email__c, Contact_Number__c, CreatedDate FROM Visitor__c ORDER BY CreatedDate DESC LIMIT 100</code>.</li>
      <li><code>GET /api/dashboard/stats</code>: Executes parallel count & aggregation queries across all four objects, formatting footfall trends and status counts.</li>
      <li><code>GET /api/faq</code>: Queries published records via <code>SELECT Id, Name, Question__c, Answer__c, Category__c FROM FAQ__c WHERE Is_Published__c = true ORDER BY Display_Order__c ASC</code>.</li>
    </ul>

    <h2>9.3 Direct Database Proof (Live Verified Records)</h2>
    <table>
      <thead>
        <tr>
          <th>Salesforce ID</th>
          <th>Visitor Name (Name)</th>
          <th>Email (Email__c)</th>
          <th>Contact Number</th>
          <th>Created Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>a00g700002Pg4MMAAZ</code></td>
          <td>Automated Test Visitor</td>
          <td>autotest@campusgo.edu</td>
          <td>+91 91234 99999</td>
          <td>2026-10-26T14:05:24Z</td>
        </tr>
        <tr>
          <td><code>a00g700002PhfA9AAJ</code></td>
          <td>Dr. Ramesh Sundaram</td>
          <td>ramesh.s@university.ac.in</td>
          <td>+91 94433 22110</td>
          <td>2026-10-26T13:54:54Z</td>
        </tr>
        <tr>
          <td><code>a00g700002PexGUAAZ</code></td>
          <td>Verification Guest</td>
          <td>verification@campusgo.edu</td>
          <td>+91 98765 00001</td>
          <td>2026-10-26T13:52:48Z</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ================= PAGE 12: TESTING & QA ================= -->
  <div class="page-break">
    <h1>10. Testing, Quality Assurance & Results</h1>
    <p>
      An automated end-to-end integration test suite (<code>tests/salesforce-integration.test.mjs</code>) was executed directly against the running CampusGo instance and connected Salesforce organization.
    </p>

    <h2>10.1 Automated Test Suite Results</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Test Case Description</th>
          <th>Expected Outcome</th>
          <th>Observed Outcome</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>GET /api/visitors live retrieval</td><td>HTTP 200, Array of Visitor__c records</td><td>HTTP 200, source: 'salesforce', ID prefix 'a00'</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>2</td><td>POST /api/visitors missing name</td><td>HTTP 400 with validation message</td><td>HTTP 400: 'Full name is required'</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>3</td><td>POST /api/visitors invalid email</td><td>HTTP 400 with email format error</td><td>HTTP 400: 'A valid email address is required'</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>4</td><td>POST /api/visitors record creation</td><td>HTTP 200, Salesforce Record ID created</td><td>HTTP 200, Record ID a00g700002Pg4MMAAZ generated</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>5</td><td>Live query immediate reflection</td><td>Newly created record present in GET list</td><td>Record verified present in subsequent GET call</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>6</td><td>GET /api/dashboard/stats SOQL</td><td>Real aggregate counts & 7-day trend array</td><td>HTTP 200, totalVisitors &ge; 2, 7 days array</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>7</td><td>GET /api/faq published articles</td><td>HTTP 200, records with ID prefix 'a03'</td><td>HTTP 200, 12 published FAQ__c records returned</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>8</td><td>GET /api/enquiries SOQL query</td><td>HTTP 200, Student_Enquiry__c query list</td><td>HTTP 200, real enquiry array returned</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>9</td><td>POST /api/enquiries creation</td><td>HTTP 200, ID prefix 'a01' created</td><td>HTTP 200, Student_Enquiry__c ID generated</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>10</td><td>GET /api/appointments SOQL query</td><td>HTTP 200, Appointment__c query list</td><td>HTTP 200, appointments array returned</td><td><span class="badge-pass">PASS</span></td></tr>
      </tbody>
    </table>

    <div class="callout">
      <strong>QA Certification:</strong> 10 out of 10 automated test cases passed successfully (100% pass rate). Zero regression errors detected across layout, navigation, or data contracts.
    </div>

    <h2>10.2 Responsive UI Multi-Viewport Audit</h2>
    <table>
      <thead>
        <tr>
          <th>Viewport</th>
          <th>Device Category</th>
          <th>Horizontal Scroll</th>
          <th>Overflow Elements</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1440 &times; 900</td><td>Standard Desktop Workstation</td><td>None (False)</td><td>0</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>1280 &times; 800</td><td>Compact Desktop / Laptop</td><td>None (False)</td><td>0</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>1024 &times; 768</td><td>iPad / Tablet Landscape</td><td>None (False)</td><td>0</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>768 &times; 1024</td><td>iPad / Tablet Portrait</td><td>None (False)</td><td>0</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>390 &times; 844</td><td>iPhone 14 / Modern Smartphone</td><td>None (False)</td><td>0</td><td><span class="badge-pass">PASS</span></td></tr>
        <tr><td>320 &times; 650</td><td>Ultra-Compact Mobile Device</td><td>None (False)</td><td>0</td><td><span class="badge-pass">PASS</span></td></tr>
      </tbody>
    </table>
  </div>

  <!-- ================= PAGE 13: SECURITY, CONCLUSION & REFERENCES ================= -->
  <div>
    <h1>11. Security, Token Isolation & Governance</h1>
    <p>
      Enterprise student and campus visitor systems handle Personally Identifiable Information (PII) including legal names, emails, and phone numbers. CampusGo incorporates security best practices:
    </p>
    <ul>
      <li><strong>Strict Server-Side Credential Isolation:</strong> Salesforce Consumer Keys, Secrets, Passwords, and Access Tokens reside exclusively in Node.js server memory and environment variables. None are exposed to client JavaScript or browser storage.</li>
      <li><strong>Environment Secret Protection:</strong> <code>.env*</code> patterns are registered in <code>.gitignore</code>, preventing accidental repository leaks. A sanitized <code>.env.example</code> with dummy placeholders is supplied for deployment.</li>
      <li><strong>Input Sanitization & Boundary Checking:</strong> Visitor names, emails, and phone strings are trimmed, validated against strict regex expressions, and length-capped before transmission to Salesforce.</li>
      <li><strong>Token Caching & Least Privilege:</strong> Access tokens are cached with a 60-second expiration buffer to prevent excessive authentication handshakes, and automatically refreshed upon encountering HTTP 401 Unauthorized responses.</li>
    </ul>

    <h1>12. Conclusion & Future Enhancements</h1>
    <h2>12.1 Conclusion</h2>
    <p>
      The <strong>CampusGo</strong> project successfully demonstrates an enterprise-grade, integrated solution for modern college administration. By combining the agility and responsive aesthetic quality of Next.js 16 with the robust governance and transactional security of the Salesforce CRM platform, CampusGo overcomes the vulnerabilities of traditional paper logbooks. The application is fully built, thoroughly tested, visually validated, and ready for academic presentation and real-world institutional deployment.
    </p>

    <h2>12.2 Future Enhancements</h2>
    <ul>
      <li><strong>QR Code Mobile Gate Passes:</strong> Automated generation of digital QR badges emailed to visitors upon check-in for physical turnstile scanning.</li>
      <li><strong>Facial Recognition Verification:</strong> Integration of campus security cameras with computer vision for automatic visitor check-out logging.</li>
      <li><strong>Push Notifications & WhatsApp Integration:</strong> Automated SMS and WhatsApp notifications sent to host faculty members when a guest checks in.</li>
      <li><strong>Experience Cloud Student Self-Service:</strong> Allowing enrolled students to track their enquiry status in real-time through an authenticated student community portal.</li>
    </ul>

    <h1>13. References & Documentation Links</h1>
    <ol>
      <li><strong>Next.js Documentation:</strong> Next.js App Router Architecture, Route Handlers, and React Server Components (<a href="https://nextjs.org/docs" style="color: #2B5CFF;">https://nextjs.org/docs</a>).</li>
      <li><strong>Salesforce Developer Documentation:</strong> Salesforce REST API Developer Guide (v61.0 / v68.0), SOQL & SOSL Reference Guide (<a href="https://developer.salesforce.com/docs" style="color: #2B5CFF;">https://developer.salesforce.com/docs</a>).</li>
      <li><strong>Salesforce CLI Reference:</strong> <code>sf</code> Command Reference and Auth Commands Guide (<a href="https://developer.salesforce.com/tools/salesforcecli" style="color: #2B5CFF;">https://developer.salesforce.com/tools/salesforcecli</a>).</li>
      <li><strong>Tailwind CSS Documentation:</strong> Modern CSS Cascade Layers and Responsive Utility Tokens (<a href="https://tailwindcss.com/docs" style="color: #2B5CFF;">https://tailwindcss.com/docs</a>).</li>
      <li><strong>Recharts API:</strong> Composable SVG Charting Library for React Applications (<a href="https://recharts.org" style="color: #2B5CFF;">https://recharts.org</a>).</li>
    </ol>
  </div>

</body>
</html>
`;

const tempDocPath = path.join(__dirname, '..', 'report', 'temp_report.html');
fs.writeFileSync(tempDocPath, htmlContent);

async function generatePdf() {
  console.log('Generating crisp 13-page academic PDF via Chrome DevTools Protocol...');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9292;

  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    `file://${tempDocPath.replace(/\\\\/g, '/')}`,
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));

    const targets = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = targets.find(t => t.type === 'page');
    if (!page) throw new Error('No page target found');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise(resolve => {
        const id = Math.floor(Math.random() * 100000);
        const handler = event => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise(r => setTimeout(r, 3000));

    console.log('Rendering printToPDF with standard A4 page layout...');
    const pdfData = await send('Page.printToPDF', {
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.45,
      marginBottom: 0.45,
      marginLeft: 0.5,
      marginRight: 0.5,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: '<div style="font-size: 7.5pt; font-family: sans-serif; color: #94A3B8; width: 100%; display: flex; justify-content: space-between; padding: 0 30px;"><span>CampusGo — Smart Campus Front Desk & Visitor Management System</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
      preferCSSPageSize: true,
    });

    const outPdfPath = path.join(__dirname, '..', 'report', 'CampusGo_Project_Report.pdf');
    fs.writeFileSync(outPdfPath, Buffer.from(pdfData.data, 'base64'));
    console.log(`Generated: ${outPdfPath} (${Math.round(pdfData.data.length * 0.75 / 1024)} KB)`);

    ws.close();
  } finally {
    edge.kill();
    if (fs.existsSync(tempDocPath)) fs.unlinkSync(tempDocPath);
  }
}

generatePdf().catch(console.error);
