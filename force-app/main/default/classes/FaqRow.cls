/**
 * One FAQ row parsed from a CSV import.
 */
public class FaqRow {
    @AuraEnabled public String question { get; set; }
    @AuraEnabled public String answer { get; set; }
    @AuraEnabled public String category { get; set; }
    @AuraEnabled public Boolean published { get; set; }
    @AuraEnabled public Decimal displayOrder { get; set; }
}
