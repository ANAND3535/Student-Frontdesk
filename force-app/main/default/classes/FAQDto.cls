/**
 * Fixed-field public representation of a published FAQ.
 */
public class FAQDto {
    @AuraEnabled public Id id { get; set; }
    @AuraEnabled public String question { get; set; }
    @AuraEnabled public String answer { get; set; }
    @AuraEnabled public String category { get; set; }
    @AuraEnabled public Decimal displayOrder { get; set; }

    /**
     * Copies only the fields exposed by the public FAQ endpoint.
     *
     * @param record Published FAQ source.
     */
    public FAQDto(FAQ__c record) {
        id = record.Id;
        question = record.Question__c;
        answer = record.Answer__c;
        category = record.Category__c;
        displayOrder = record.Display_Order__c;
    }
}
