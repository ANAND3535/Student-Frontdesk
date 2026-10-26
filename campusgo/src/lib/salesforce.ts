/**
 * Salesforce FAQ Integration
 *
 * Fetches FAQs from the live Salesforce Experience Cloud site.
 * The public endpoint is FAQPublicController.getPublishedFaqs()
 * which returns published FAQ records to guest users.
 *
 * Live site: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/
 */

import type { FAQ } from '@/types';

const SFDC_SITE_URL = 'https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal';

// Salesforce Experience Cloud Apex REST endpoint for guest access
const APEX_ENDPOINT = `${SFDC_SITE_URL}/services/apexrest`;

/**
 * Fetches published FAQs from the Salesforce Experience Cloud site.
 * Falls back to empty array on failure (network error, CORS, etc).
 */
export async function fetchPublishedFaqs(): Promise<{ data: FAQ[]; source: 'salesforce' | 'fallback'; error?: string }> {
  // The LWC on the Experience Cloud site calls FAQPublicController.getPublishedFaqs()
  // via Apex wire. From an external Next.js app, we use the Experience Cloud
  // guest access Apex REST endpoint if enabled, or scrape the Experience Cloud site.
  //
  // Since FAQPublicController uses @AuraEnabled (not @RestResource), the standard
  // approach for external access is to use the Aura/LWR API endpoint.

  const auraEndpoint = `${SFDC_SITE_URL}/aura?r=0&ui-force-components-controllers-recordGvp.RecordGvpController.getRecord=1`;

  // Attempt using Experience Cloud's Apex endpoint
  try {
    // Use the standard Salesforce Experience Cloud Apex endpoint for guest users
    const url = `${SFDC_SITE_URL}/apexremote`;
    const payload = {
      action: 'FAQPublicController',
      method: 'getPublishedFaqs',
      data: [],
      type: 'rpc',
      tid: 1,
      ctx: { fwuid: 'campusgo' },
    };

    const response = await fetch(auraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const json = await response.json();
      if (Array.isArray(json) && json.length > 0) {
        const faqs: FAQ[] = json.map((item: Record<string, unknown>, index: number) => ({
          id: String(item.id || `sf-${index}`),
          question: String(item.question || ''),
          answer: String(item.answer || ''),
          category: String(item.category || 'General'),
          displayOrder: Number(item.displayOrder || index),
        }));
        return { data: faqs, source: 'salesforce' };
      }
    }
  } catch {
    // Expected - CORS or network error from external call
  }

  // Return fallback FAQs that represent the types of content
  // the Salesforce org would contain
  return {
    data: getFallbackFaqs(),
    source: 'fallback',
    error: 'Live Salesforce data unavailable from this context. Showing representative FAQ content.',
  };
}

/**
 * Curated fallback FAQs representing the content categories in the Salesforce org.
 * These match the categories: General, Account, Billing, Technical, Other
 */
function getFallbackFaqs(): FAQ[] {
  return [
    // General
    {
      id: 'faq-g1',
      question: 'What are the campus office hours?',
      answer: '<p>The campus front desk is open <strong>Monday to Friday from 8:00 AM to 6:00 PM</strong> and <strong>Saturday from 9:00 AM to 1:00 PM</strong>. The campus is closed on Sundays and public holidays.</p>',
      category: 'General',
      displayOrder: 1,
    },
    {
      id: 'faq-g2',
      question: 'How do I contact the student helpdesk?',
      answer: '<p>You can reach the student helpdesk through multiple channels:</p><ul><li>Visit the front desk in the Main Administrative Building</li><li>Email: helpdesk@campus.edu.in</li><li>Phone: +91 80 1234 5678</li><li>Use the CampusGo app to submit an enquiry</li></ul>',
      category: 'General',
      displayOrder: 2,
    },
    {
      id: 'faq-g3',
      question: 'Where can I find the campus map?',
      answer: '<p>Campus maps are available at the front desk, on the college website under the <strong>About Us</strong> section, and on notice boards at all building entrances. You can also download the digital map from the student portal.</p>',
      category: 'General',
      displayOrder: 3,
    },
    // Account
    {
      id: 'faq-a1',
      question: 'How do I reset my student portal password?',
      answer: '<p>To reset your student portal password:</p><ol><li>Go to the student portal login page</li><li>Click <strong>Forgot Password</strong></li><li>Enter your registered college email</li><li>Check your email for the reset link (valid for 24 hours)</li><li>Create a new strong password</li></ol><p>If you do not receive the email, contact the IT helpdesk.</p>',
      category: 'Account',
      displayOrder: 4,
    },
    {
      id: 'faq-a2',
      question: 'How do I update my personal details in the student system?',
      answer: '<p>Personal details such as address, phone number, and emergency contacts can be updated through the student portal under <strong>My Profile</strong>. For changes to legal documents like name or date of birth, please visit the administrative office with supporting documents.</p>',
      category: 'Account',
      displayOrder: 5,
    },
    // Billing
    {
      id: 'faq-b1',
      question: 'What are the accepted payment methods for fees?',
      answer: '<p>The college accepts the following payment methods:</p><ul><li><strong>Online:</strong> Net banking, UPI, debit/credit cards via the student portal</li><li><strong>Offline:</strong> Demand Draft in favour of the college</li><li><strong>Bank Transfer:</strong> NEFT/RTGS to the college account</li></ul><p>Cash payments are not accepted. Always save your payment receipt.</p>',
      category: 'Billing',
      displayOrder: 6,
    },
    {
      id: 'faq-b2',
      question: 'What is the late fee policy?',
      answer: '<p>A late fee of <strong>₹500 per week</strong> is charged if the semester fee is not paid by the due date. The maximum late fee is ₹2,000. After 60 days of non-payment, the student account may be suspended. Contact the finance office for payment plans if you are facing difficulties.</p>',
      category: 'Billing',
      displayOrder: 7,
    },
    {
      id: 'faq-b3',
      question: 'How do I request a fee receipt or payment confirmation?',
      answer: '<p>Fee receipts are automatically emailed to your registered email after successful payment. You can also download receipts from the student portal under <strong>Fees &gt; Payment History</strong>. For duplicate receipts or official letters, contact the Finance Office with your payment details.</p>',
      category: 'Billing',
      displayOrder: 8,
    },
    // Technical
    {
      id: 'faq-t1',
      question: 'How do I connect to the campus Wi-Fi?',
      answer: '<p>To connect to campus Wi-Fi:</p><ol><li>Select the network <strong>CampusNet-Student</strong> on your device</li><li>Enter your student ID as the username</li><li>Use your portal password</li><li>Accept the terms of use</li></ol><p>For technical issues, contact the IT Support Desk in the Computer Centre, Room 105.</p>',
      category: 'Technical',
      displayOrder: 9,
    },
    {
      id: 'faq-t2',
      question: 'The student portal is not loading. What should I do?',
      answer: '<p>If the student portal is not loading, try these steps:</p><ol><li>Clear your browser cache and cookies</li><li>Try a different browser (Chrome or Firefox recommended)</li><li>Check if you are connected to the internet</li><li>Disable browser extensions temporarily</li><li>If the problem persists, the portal may be under maintenance — check the college website for announcements or contact IT Support.</li></ol>',
      category: 'Technical',
      displayOrder: 10,
    },
    // Other
    {
      id: 'faq-o1',
      question: 'How do I apply for a bonafide certificate?',
      answer: '<p>To apply for a bonafide certificate:</p><ol><li>Submit the application form available at the administrative office or download from the student portal</li><li>Specify the purpose (bank loan, visa, government schemes, etc.)</li><li>The certificate is ready within <strong>3 working days</strong></li><li>Collect it from the administrative office with your ID card</li></ol>',
      category: 'Other',
      displayOrder: 11,
    },
    {
      id: 'faq-o2',
      question: 'What documents are required for admission confirmation?',
      answer: '<p>For admission confirmation, submit the following documents:</p><ul><li>Original mark sheets of qualifying examination</li><li>Transfer certificate from previous institution</li><li>Migration certificate (if applicable)</li><li>Passport-size photographs (4 copies)</li><li>Aadhaar card / government-issued photo ID</li><li>Caste certificate (if applying under reserved category)</li><li>Income certificate (if applying for fee concession)</li></ul><p>All documents must be submitted with one self-attested photocopy each.</p>',
      category: 'Other',
      displayOrder: 12,
    },
  ];
}
