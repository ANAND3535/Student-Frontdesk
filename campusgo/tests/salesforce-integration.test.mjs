/**
 * CampusGo Salesforce End-to-End Integration Test Suite
 */

import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting CampusGo Salesforce Integration Test Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  // Test 1: GET /api/visitors - Live retrieval from Salesforce
  await test('1. GET /api/visitors returns live records from Salesforce Visitor__c', async () => {
    const res = await fetch(`${BASE_URL}/api/visitors`);
    assert.strictEqual(res.status, 200, 'Expected HTTP 200');
    const json = await res.json();
    assert.strictEqual(json.success, true, 'Expected success: true');
    assert.strictEqual(json.source, 'salesforce', 'Expected source: salesforce');
    assert.ok(Array.isArray(json.visitors), 'Expected visitors array');
    assert.ok(json.visitors.length > 0, 'Expected at least 1 record from previous tests');
    assert.ok(json.visitors[0].id.startsWith('a00'), 'Expected valid Salesforce 15/18 char ID prefix a00');
  });

  // Test 2: POST /api/visitors - Validation error on missing name
  await test('2. POST /api/visitors rejects invalid payload (missing name)', async () => {
    const res = await fetch(`${BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', phone: '123' }),
    });
    assert.strictEqual(res.status, 400, 'Expected HTTP 400 for missing name');
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.error.includes('name is required'), 'Expected specific validation message');
  });

  // Test 3: POST /api/visitors - Validation error on invalid email
  await test('3. POST /api/visitors rejects invalid email format', async () => {
    const res = await fetch(`${BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Valid Name', email: 'notanemail', phone: '123' }),
    });
    assert.strictEqual(res.status, 400, 'Expected HTTP 400 for bad email');
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.error.includes('valid email'), 'Expected specific email validation message');
  });

  // Test 4: POST /api/visitors - Successful creation in Salesforce
  let createdVisitorId = '';
  await test('4. POST /api/visitors creates a real record in Salesforce Visitor__c', async () => {
    const payload = {
      name: 'Automated Test Visitor',
      email: 'autotest@campusgo.edu',
      phone: '+91 91234 99999',
      purpose: 'Meeting',
      hostName: 'Registrar Office',
    };
    const res = await fetch(`${BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.strictEqual(res.status, 200, 'Expected HTTP 200');
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.id && json.id.startsWith('a00'), `Expected real Salesforce ID, got: ${json.id}`);
    assert.strictEqual(json.visitor.name, payload.name);
    createdVisitorId = json.id;
  });

  // Test 5: Verify created visitor is immediately queryable via GET /api/visitors
  await test('5. GET /api/visitors immediately reflects newly registered visitor', async () => {
    const res = await fetch(`${BASE_URL}/api/visitors`);
    const json = await res.json();
    const found = json.visitors.find(v => v.id === createdVisitorId);
    assert.ok(found, `Expected visitor with ID ${createdVisitorId} to be returned in list`);
  });

  // Test 6: GET /api/dashboard/stats - Real metrics against Salesforce
  await test('6. GET /api/dashboard/stats returns aggregate counts and real footfall trend', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.source, 'salesforce');
    assert.ok(typeof json.stats.totalVisitors === 'number', 'totalVisitors must be a number');
    assert.ok(json.stats.totalVisitors >= 2, 'Expected at least 2 visitors created');
    assert.ok(Array.isArray(json.visitorChartData), 'Expected visitorChartData array');
    assert.strictEqual(json.visitorChartData.length, 7, 'Expected 7-day trend array');
    assert.ok(Array.isArray(json.enquiryStatusData), 'Expected enquiryStatusData array');
  });

  // Test 7: GET /api/faq - Real published FAQs from Salesforce FAQ__c
  await test('7. GET /api/faq returns live records from Salesforce FAQ__c', async () => {
    const res = await fetch(`${BASE_URL}/api/faq`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.source, 'salesforce');
    assert.ok(json.data.length > 0, 'Expected published FAQs');
    assert.ok(json.data[0].id.startsWith('a03'), 'Expected FAQ__c ID prefix a03');
  });

  // Test 8: GET /api/enquiries - Real retrieval from Student_Enquiry__c
  await test('8. GET /api/enquiries returns query results for Student_Enquiry__c', async () => {
    const res = await fetch(`${BASE_URL}/api/enquiries`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.source, 'salesforce');
    assert.ok(Array.isArray(json.enquiries));
  });

  // Test 9: POST /api/enquiries - Creation in Salesforce Student_Enquiry__c
  await test('9. POST /api/enquiries creates a record in Student_Enquiry__c', async () => {
    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Integration Student',
        subject: 'Scholarship Application Query',
      }),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.id && json.id.startsWith('a01'), `Expected Student_Enquiry__c ID prefix a01, got: ${json.id}`);
  });

  // Test 10: GET /api/appointments - Real retrieval from Appointment__c
  await test('10. GET /api/appointments returns query results for Appointment__c', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.source, 'salesforce');
    assert.ok(Array.isArray(json.appointments));
  });

  console.log(`\n🏁 Test Results: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)\n`);
  if (passed !== total) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
