/**
 * Result returned by a successful FAQ save.
 */
public class FAQSaveResult {
    @AuraEnabled public FAQ__c faq { get; set; }
    @AuraEnabled public String warning { get; set; }
}
