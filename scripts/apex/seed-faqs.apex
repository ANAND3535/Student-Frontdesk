Integer publishedCount = [
    SELECT COUNT()
    FROM FAQ__c
    WHERE Is_Published__c = true
];

if (publishedCount < 5) {
    insert new List<FAQ__c>{
        new FAQ__c(Question__c = 'How do I reset my password?', Answer__c = '<p>Choose <strong>Forgot Password</strong> on the sign-in page and follow the email instructions.</p>', Category__c = 'Account', Is_Published__c = true, Display_Order__c = 10),
        new FAQ__c(Question__c = 'How can I update my email address?', Answer__c = '<p>Open your profile settings, change your email, and complete the verification sent to your new address.</p>', Category__c = 'Account', Is_Published__c = true, Display_Order__c = 20),
        new FAQ__c(Question__c = 'Where can I see my course schedule?', Answer__c = '<p>Sign in and open the student dashboard to view your current course schedule.</p>', Category__c = 'General', Is_Published__c = true, Display_Order__c = 10),
        new FAQ__c(Question__c = 'How do I request an enrollment letter?', Answer__c = '<p>Submit an enrollment-letter request through the student services office.</p>', Category__c = 'General', Is_Published__c = true, Display_Order__c = 20),
        new FAQ__c(Question__c = 'When is my tuition payment due?', Answer__c = '<p>Your due date is shown on the current term invoice in the billing area.</p>', Category__c = 'Billing', Is_Published__c = true, Display_Order__c = 10),
        new FAQ__c(Question__c = 'How do I download a payment receipt?', Answer__c = '<p>Open Billing, select the completed payment, and choose Download Receipt.</p>', Category__c = 'Billing', Is_Published__c = true, Display_Order__c = 20),
        new FAQ__c(Question__c = 'What payment methods are accepted?', Answer__c = '<p>Available payment methods are listed on the checkout page before you submit payment.</p>', Category__c = 'Billing', Is_Published__c = true, Display_Order__c = 30),
        new FAQ__c(Question__c = 'How can I correct a payment posted to the wrong term?', Answer__c = '<p>Contact the billing office with your student ID and payment reference so the allocation can be reviewed.</p>', Category__c = 'Billing', Is_Published__c = true, Display_Order__c = 40),
        new FAQ__c(Question__c = 'Which browsers work best with the student portal?', Answer__c = '<p>Use a current version of Chrome, Edge, Firefox, or Safari with cookies and JavaScript enabled.</p>', Category__c = 'Technical', Is_Published__c = true, Display_Order__c = 10),
        new FAQ__c(Question__c = 'What should I do if a page will not load?', Answer__c = '<p>Refresh the page, check your connection, and try again in a private browser window. Contact support if the problem continues.</p>', Category__c = 'Technical', Is_Published__c = true, Display_Order__c = 20),
        new FAQ__c(Question__c = 'How do I upload an assignment?', Answer__c = '<p>Open the course assignment, choose Upload, select your file, and confirm that the submission status changes to Submitted.</p>', Category__c = 'Technical', Is_Published__c = true, Display_Order__c = 30),
        new FAQ__c(Question__c = 'Who can help with a campus service request?', Answer__c = '<p>Use the campus services directory to find the team responsible for your request.</p>', Category__c = 'General', Is_Published__c = true, Display_Order__c = 30)
    };
}
