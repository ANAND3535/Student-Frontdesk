System.assert(
    FeatureManagement.checkPermission('FAQ_Admin_Access'),
    'Run this verification as a user assigned FAQ_Admin.'
);

Integer publishedBefore = [
    SELECT COUNT()
    FROM FAQ__c
    WHERE Is_Published__c = true
];
FAQSaveResult saved = FAQAdminController.saveFaq(
    new FAQ__c(
        Question__c = 'Verification FAQ ' + String.valueOf(DateTime.now().getTime()),
        Answer__c = '<p>This record is created for verification and then removed.</p>',
        Category__c = 'General',
        Is_Published__c = true,
        Display_Order__c = 999
    )
);
List<FAQDto> afterSave = FAQPublicController.getPublishedFaqs();
System.assertEquals(publishedBefore + 1, afterSave.size());
Boolean newFaqIsVisible = false;
for (FAQDto faq : afterSave) {
    if (faq.id == saved.faq.Id) {
        newFaqIsVisible = true;
        break;
    }
}
System.assert(newFaqIsVisible, 'A newly published FAQ must appear immediately.');

FAQAdminController.setPublished(saved.faq.Id, false);
System.assertEquals(publishedBefore, FAQPublicController.getPublishedFaqs().size());
FAQAdminController.deleteFaq(saved.faq.Id);
System.assertEquals(publishedBefore, FAQPublicController.getPublishedFaqs().size());
System.debug(
    'ADMIN_SAVE_PUBLISH_UNPUBLISH_DELETE_VERIFIED=' + saved.faq.Id
);
