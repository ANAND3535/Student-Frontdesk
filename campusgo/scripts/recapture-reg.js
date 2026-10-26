const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9281;
const edge = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=' + port,
  '--window-size=1440,900',
  'http://localhost:3000/visitors',
]);

setTimeout(async () => {
  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:' + port + '/json', res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = targets.find(t => t.type === 'page');
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

    await new Promise(r => setTimeout(r, 2000));
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Register New Visitor'));
        if (btn) btn.click();
        setTimeout(() => {
          const formInputs = document.querySelectorAll('form input');
          if (formInputs[0]) formInputs[0].value = 'Dr. Vikram Sarabhai';
          if (formInputs[1]) formInputs[1].value = 'sarabhai@isro.ac.in';
          if (formInputs[2]) formInputs[2].value = '+91 98765 43210';
          const txt = document.querySelector('form textarea');
          if (txt) txt.value = 'Annual science fellowship evaluation & campus keynote discussion.';
        }, 400);
      })()`,
      awaitPromise: true,
    });

    await new Promise(r => setTimeout(r, 1200));
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(__dirname, '..', 'report', 'screenshots', '03_visitor_registration.png');
    fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
    console.log('Recaptured 03_visitor_registration.png successfully!');
    ws.close();
    edge.kill();
    process.exit(0);
  } catch (e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1500);
