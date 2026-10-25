/**
 * Read-only public FAQ API.
 */
public without sharing class FAQPublicController {
    /**
     * Returns published FAQs only, exposing fixed read-only fields to guests.
     * System context is safe here because this endpoint cannot write and its
     * query always enforces publication and selects only public FAQ content.
     *
     * @return Published FAQs in display order.
     */
    @AuraEnabled(cacheable=false)
    public static List<FAQDto> getPublishedFaqs() {
        List<FAQ__c> records = [
            SELECT Id, Question__c, Answer__c, Category__c, Display_Order__c, CreatedDate
            FROM FAQ__c
            WHERE Is_Published__c = true
            ORDER BY Category__c ASC NULLS LAST, Display_Order__c ASC, CreatedDate ASC
            LIMIT 500
        ];

        List<FAQDto> result = new List<FAQDto>();
        for (FAQ__c record : records) {
            result.add(new FAQDto(record));
        }
        return result;
    }
}
