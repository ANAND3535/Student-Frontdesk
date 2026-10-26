import type { FAQ } from '@/types';

/**
 * Returns the same fallback FAQs used in the public salesforce module,
 * exposed separately so the admin panel can import them without pulling in
 * the full fetch logic.
 */
export function getFallbackFaqs(): FAQ[] {
  return [
    { id: 'faq-g1', question: 'What are the campus office hours?', answer: '<p>The campus front desk is open <strong>Monday to Friday from 8:00 AM to 6:00 PM</strong> and <strong>Saturday from 9:00 AM to 1:00 PM</strong>. The campus is closed on Sundays and public holidays.</p>', category: 'General', displayOrder: 1 },
    { id: 'faq-g2', question: 'How do I contact the student helpdesk?', answer: '<p>You can reach the student helpdesk through multiple channels:</p><ul><li>Visit the front desk in the Main Administrative Building</li><li>Email: helpdesk@campus.edu.in</li><li>Phone: +91 80 1234 5678</li><li>Use the CampusGo app to submit an enquiry</li></ul>', category: 'General', displayOrder: 2 },
    { id: 'faq-g3', question: 'Where can I find the campus map?', answer: '<p>Campus maps are available at the front desk, on the college website under the <strong>About Us</strong> section, and on notice boards at all building entrances.</p>', category: 'General', displayOrder: 3 },
    { id: 'faq-a1', question: 'How do I reset my student portal password?', answer: '<p>To reset your student portal password:</p><ol><li>Go to the student portal login page</li><li>Click <strong>Forgot Password</strong></li><li>Enter your registered college email</li><li>Check your email for the reset link (valid for 24 hours)</li><li>Create a new strong password</li></ol>', category: 'Account', displayOrder: 4 },
    { id: 'faq-a2', question: 'How do I update my personal details in the student system?', answer: '<p>Personal details such as address, phone number, and emergency contacts can be updated through the student portal under <strong>My Profile</strong>.</p>', category: 'Account', displayOrder: 5 },
    { id: 'faq-b1', question: 'What are the accepted payment methods for fees?', answer: '<p>The college accepts the following payment methods:</p><ul><li><strong>Online:</strong> Net banking, UPI, debit/credit cards via the student portal</li><li><strong>Offline:</strong> Demand Draft in favour of the college</li><li><strong>Bank Transfer:</strong> NEFT/RTGS to the college account</li></ul>', category: 'Billing', displayOrder: 6 },
    { id: 'faq-b2', question: 'What is the late fee policy?', answer: '<p>A late fee of <strong>₹500 per week</strong> is charged if the semester fee is not paid by the due date. The maximum late fee is ₹2,000.</p>', category: 'Billing', displayOrder: 7 },
    { id: 'faq-b3', question: 'How do I request a fee receipt or payment confirmation?', answer: '<p>Fee receipts are automatically emailed to your registered email after successful payment. You can also download receipts from the student portal under <strong>Fees &gt; Payment History</strong>.</p>', category: 'Billing', displayOrder: 8 },
    { id: 'faq-t1', question: 'How do I connect to the campus Wi-Fi?', answer: '<p>To connect to campus Wi-Fi:</p><ol><li>Select the network <strong>CampusNet-Student</strong> on your device</li><li>Enter your student ID as the username</li><li>Use your portal password</li></ol>', category: 'Technical', displayOrder: 9 },
    { id: 'faq-t2', question: 'The student portal is not loading. What should I do?', answer: '<p>If the student portal is not loading, try these steps:</p><ol><li>Clear your browser cache and cookies</li><li>Try a different browser (Chrome or Firefox recommended)</li><li>Check if you are connected to the internet</li></ol>', category: 'Technical', displayOrder: 10 },
    { id: 'faq-o1', question: 'How do I apply for a bonafide certificate?', answer: '<p>To apply for a bonafide certificate:</p><ol><li>Submit the application form at the administrative office</li><li>Specify the purpose</li><li>The certificate is ready within <strong>3 working days</strong></li></ol>', category: 'Other', displayOrder: 11 },
    { id: 'faq-o2', question: 'What documents are required for admission confirmation?', answer: '<p>For admission confirmation, submit the following documents:</p><ul><li>Original mark sheets of qualifying examination</li><li>Transfer certificate from previous institution</li><li>Passport-size photographs (4 copies)</li><li>Aadhaar card / government-issued photo ID</li></ul>', category: 'Other', displayOrder: 12 },
  ];
}
