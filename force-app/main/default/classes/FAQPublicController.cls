/**
 * Read-only public FAQ API.
 */
public without sharing class FAQPublicController {
    /**
     * A fixed-field view of a published FAQ.
     */
    public class FAQDto {
        @AuraEnabled public Id id { get; set; }
        @AuraEnabled public String question { get; set; }
        @AuraEnabled public String answer { get; set; }
        @AuraEnabled public String category { get; set; }
        @AuraEnabled public Decimal displayOrder { get; set; }

        public FAQDto(FAQ__c record) {
            id = record.Id;
            question = record.Question__c;
            answer = record.Answer__c;
            category = record.Category__c;
            displayOrder = record.Display_Order__c;
        }
    }

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
