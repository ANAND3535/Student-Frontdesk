const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'report', 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runSession(url, actions, outFilename, options = {}) {
  const width = options.width || 1440;
  const height = options.height || 900;
  const port = 9230 + Math.floor(Math.random() * 50);

  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    url,
  ]);

  try {
    await sleep(1500);

    const targets = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = targets.find(t => t.type === 'page');
    if (!page) throw new Error('No page target');

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

    // Wait for hydration and data fetching
    await sleep(2500);

    if (actions) {
      await send('Runtime.evaluate', {
        expression: actions,
        awaitPromise: true,
      });
      await sleep(1000);
    }

    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });

    const filePath = path.join(outDir, outFilename);
    fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Saved screenshot: ${outFilename}`);

    ws.close();
  } finally {
    edge.kill();
    await sleep(500);
  }
}

async function main() {
  console.log('Capturing report screenshots...');

  // 1. Dashboard Overview
  await runSession('http://localhost:3000/dashboard', null, '01_dashboard.png');

  // 2. Dashboard Analytics (scroll to charts)
  await runSession(
    'http://localhost:3000/dashboard',
    `(() => {
      const chartEl = document.querySelector('.recharts-responsive-container') || document.querySelector('h2');
      if (chartEl) chartEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`,
    '02_dashboard_analytics.png'
  );

  // 3. Visitor Registration Modal
  await runSession(
    'http://localhost:3000/visitors',
    `(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Register New Visitor'));
      if (btn) btn.click();
      setTimeout(() => {
        const inputs = document.querySelectorAll('input');
        if (inputs[1]) inputs[1].value = 'Dr. Vikram Sarabhai';
        if (inputs[2]) inputs[2].value = 'sarabhai@isro.ac.in';
        if (inputs[3]) inputs[3].value = '+91 98765 43210';
        const txt = document.querySelector('textarea');
        if (txt) txt.value = 'Annual science fellowship evaluation & campus keynote discussion.';
      }, 300);
    })()`,
    '03_visitor_registration.png'
  );

  // 4. Visitor Records Table
  await runSession('http://localhost:3000/visitors', null, '04_visitor_records.png');

  // 5. Student Enquiries
  await runSession('http://localhost:3000/enquiries', null, '05_student_enquiries.png');

  // 6. Appointments
  await runSession('http://localhost:3000/appointments', null, '06_appointments.png');

  // 7. FAQ Knowledge Directory
  await runSession('http://localhost:3000/faq', null, '07_faq_management.png');

  // 8. Admin Panel Overview
  await runSession('http://localhost:3000/admin', null, '08_admin_panel.png');

  // 9. Salesforce Integration Endpoints (Admin panel tab or focused view)
  await runSession(
    'http://localhost:3000/admin',
    `(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const kmTab = tabs.find(b => b.textContent.includes('Knowledge Management'));
      if (kmTab) kmTab.click();
    })()`,
    '09_salesforce_integration.png'
  );

  console.log('All 9 web screenshots captured!');
}

main().catch(console.error);
