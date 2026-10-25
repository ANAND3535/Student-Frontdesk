Integer publishedCount = [
    SELECT COUNT()
    FROM FAQ__c
    WHERE Is_Published__c = true
];
Integer endpointCount = FAQPublicController.getPublishedFaqs().size();
System.assertEquals(
    publishedCount,
    endpointCount,
    'The public API must return exactly the published FAQ count.'
);
System.debug('PUBLIC_FAQ_COUNT_VERIFIED=' + endpointCount);
