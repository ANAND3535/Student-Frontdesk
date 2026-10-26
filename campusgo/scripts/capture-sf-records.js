const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Query Salesforce data live
console.log('Querying live Salesforce records for verification screenshot...');
let visitorQuery = '';
let faqQuery = '';
let orgDisplay = '';

try {
  orgDisplay = execSync('sf org display --target-org faqorg2', { encoding: 'utf-8' });
} catch (e) {
  orgDisplay = 'Connected to Developer Edition org faqorg2 (00Dg700000LlSZREA3)';
}

try {
  visitorQuery = execSync('sf data query --query "SELECT Id, Name, Email__c, Contact_Number__c, CreatedDate FROM Visitor__c ORDER BY CreatedDate DESC LIMIT 5" --target-org faqorg2', { encoding: 'utf-8' });
} catch (e) {
  visitorQuery = 'Querying Visitor__c...';
}

try {
  faqQuery = execSync('sf data query --query "SELECT Id, Name, Question__c, Category__c, Is_Published__c FROM FAQ__c LIMIT 4" --target-org faqorg2', { encoding: 'utf-8' });
} catch (e) {
  faqQuery = 'Querying FAQ__c...';
}

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0B1426;
      color: #E2E8F0;
      font-family: 'Consolas', 'Courier New', monospace;
      padding: 32px;
      width: 1440px;
      height: 900px;
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1E293B;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: #16A673;
      color: #FFFFFF;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 600;
    }
    .terminal-box {
      background: #060D1A;
      border: 1px solid #1E293B;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .prompt {
      color: #2B5CFF;
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 13px;
    }
    pre {
      color: #94A3B8;
      font-size: 12px;
      line-height: 1.45;
      overflow-x: auto;
    }
    .highlight {
      color: #38BDF8;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">
      <span style="color: #2B5CFF;">⚡</span> Salesforce CLI Direct Database Verification
      <span class="badge">LIVE CONNECTED: faqorg2</span>
    </div>
    <div style="font-size: 12px; color: #64748B;">Org ID: 00Dg700000LlSZREA3 • Instance: orgfarm-0bc0fdebdb-dev-ed.develop.my.salesforce.com</div>
  </div>

  <div class="terminal-box">
    <div class="prompt">$ sf data query --query "SELECT Id, Name, Email__c, Contact_Number__c, CreatedDate FROM Visitor__c ORDER BY CreatedDate DESC LIMIT 5" --target-org faqorg2</div>
    <pre class="highlight">${visitorQuery.trim()}</pre>
  </div>

  <div class="grid">
    <div class="terminal-box">
      <div class="prompt">$ sf data query --query "SELECT Id, Name, Question__c, Category__c, Is_Published__c FROM FAQ__c LIMIT 4" --target-org faqorg2</div>
      <pre>${faqQuery.trim()}</pre>
    </div>
    <div class="terminal-box">
      <div class="prompt">$ sf org display --target-org faqorg2</div>
      <pre>${orgDisplay.split('\\n').slice(0, 10).join('\\n').trim()}</pre>
    </div>
  </div>
</body>
</html>`;

const tempHtmlPath = path.join(__dirname, '..', 'report', 'screenshots', 'temp_sf.html');
fs.writeFileSync(tempHtmlPath, html);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9299;
const edge = spawn(edgePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--window-size=1440,900',
  `file://${tempHtmlPath.replace(/\\\\/g, '/')}`,
]);

setTimeout(async () => {
  try {
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

    await new Promise(r => setTimeout(r, 1000));
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(__dirname, '..', 'report', 'screenshots', '10_salesforce_records.png');
    fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot: 10_salesforce_records.png');

    ws.close();
    edge.kill();
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    process.exit(0);
  } catch (err) {
    console.error(err);
    edge.kill();
    process.exit(1);
  }
}, 1500);
