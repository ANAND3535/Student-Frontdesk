/**
 * Counts and diagnostics returned by a partial FAQ CSV import.
 */
public class FAQImportResult {
    @AuraEnabled public Integer inserted { get; set; }
    @AuraEnabled public Integer failed { get; set; }
    @AuraEnabled public List<String> errors { get; set; }
    @AuraEnabled public List<String> warnings { get; set; }

    /**
     * Initializes the result with empty diagnostics and zero counts.
     */
    public FAQImportResult() {
        inserted = 0;
        failed = 0;
        errors = new List<String>();
        warnings = new List<String>();
    }
}
