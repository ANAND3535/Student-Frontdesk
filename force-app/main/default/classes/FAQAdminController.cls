/**
 * Permission-gated API for FAQ administration.
 */
public with sharing class FAQAdminController {
    /**
     * Indicates whether the current user has FAQ administration access.
     *
     * @return True when the FAQ admin custom permission is assigned.
     */
    @AuraEnabled(cacheable=true)
    public static Boolean isAdmin() {
        return FeatureManagement.checkPermission('FAQ_Admin_Access');
    }

    /**
     * Lists FAQs visible to the authorized administrator.
     *
     * @param searchTerm Optional question search.
     * @return Matching FAQ records.
     */
    @AuraEnabled(cacheable=false)
    public static List<FAQ__c> getAllFaqs(String searchTerm) {
        requireAdmin();
        List<FAQ__c> records;
        if (String.isBlank(searchTerm)) {
            records = [
                SELECT Id, Name, Question__c, Answer__c, Category__c,
                    Is_Published__c, Display_Order__c, LastModifiedDate
                FROM FAQ__c
                WITH USER_MODE
                ORDER BY LastModifiedDate DESC
                LIMIT 2000
            ];
        } else {
            String searchPattern = '%' + searchTerm.trim() + '%';
            records = [
                SELECT Id, Name, Question__c, Answer__c, Category__c,
                    Is_Published__c, Display_Order__c, LastModifiedDate
                FROM FAQ__c
                WHERE Question__c LIKE :searchPattern
                WITH USER_MODE
                ORDER BY LastModifiedDate DESC
                LIMIT 2000
            ];
        }
        return (List<FAQ__c>) Security.stripInaccessible(
            AccessType.READABLE,
            records
        ).getRecords();
    }

    /**
     * Creates or updates an FAQ after trimming and validating its content.
     *
     * @param faq FAQ record to save.
     * @return The saved record and any duplicate-question warning.
     */
    @AuraEnabled
    public static FAQSaveResult saveFaq(FAQ__c faq) {
        requireAdmin();
        FAQService.normalizeAndValidate(faq);
        String warning = FAQService.duplicateWarning(faq.Question__c, faq.Id);

        AccessType accessType = faq.Id == null
            ? AccessType.CREATABLE
            : AccessType.UPDATABLE;
        SObjectAccessDecision decision = Security.stripInaccessible(
            accessType,
            new List<SObject>{ faq }
        );
        if (!decision.getRemovedFields().isEmpty()) {
            throw new AuraHandledException('You do not have access to all FAQ fields.');
        }

        FAQ__c safeFaq = (FAQ__c) decision.getRecords()[0];
        try {
            if (safeFaq.Id == null) {
                Database.insert(safeFaq, AccessLevel.USER_MODE);
            } else {
                Database.update(safeFaq, AccessLevel.USER_MODE);
            }
        } catch (DmlException error) {
            throw new AuraHandledException(error.getDmlMessage(0));
        }

        FAQSaveResult result = new FAQSaveResult();
        result.faq = safeFaq;
        result.warning = warning;
        return result;
    }

    /**
     * Updates the publication state of an FAQ.
     *
     * @param faqId FAQ identifier.
     * @param published New publication state.
     */
    @AuraEnabled
    public static void setPublished(Id faqId, Boolean published) {
        requireAdmin();
        if (faqId == null || published == null) {
            throw new AuraHandledException('A FAQ and publication state are required.');
        }
        FAQ__c faq = [
            SELECT Id, Is_Published__c
            FROM FAQ__c
            WHERE Id = :faqId
            WITH USER_MODE
            LIMIT 1
        ];
        faq.Is_Published__c = published;
        SObjectAccessDecision decision = Security.stripInaccessible(
            AccessType.UPDATABLE,
            new List<SObject>{ faq }
        );
        if (!decision.getRemovedFields().isEmpty()) {
            throw new AuraHandledException('You do not have access to update publication status.');
        }
        Database.update((FAQ__c) decision.getRecords()[0], AccessLevel.USER_MODE);
    }

    /**
     * Deletes an FAQ.
     *
     * @param faqId FAQ identifier.
     */
    @AuraEnabled
    public static void deleteFaq(Id faqId) {
        requireAdmin();
        if (faqId == null) {
            throw new AuraHandledException('A FAQ is required.');
        }
        FAQ__c faq = [
            SELECT Id
            FROM FAQ__c
            WHERE Id = :faqId
            WITH USER_MODE
            LIMIT 1
        ];
        Database.delete(faq, AccessLevel.USER_MODE);
    }

    /**
     * Validates and partially inserts up to 2,000 CSV rows.
     *
     * @param rows Rows parsed from the uploaded CSV.
     * @return Insert counts, row-specific errors, and duplicate warnings.
     */
    @AuraEnabled
    public static FAQImportResult importFaqs(List<FaqRow> rows) {
        requireAdmin();
        FAQImportResult result = new FAQImportResult();
        if (rows == null || rows.isEmpty()) {
            throw new AuraHandledException('The import contains no rows.');
        }
        if (rows.size() > 2000) {
            throw new AuraHandledException('Import no more than 2,000 rows at a time.');
        }

        List<FAQ__c> records = new List<FAQ__c>();
        List<Integer> sourceRows = new List<Integer>();
        Set<String> questions = new Set<String>();
        for (Integer indexValue = 0; indexValue < rows.size(); indexValue++) {
            try {
                if (rows[indexValue] == null) {
                    throw new AuraHandledException('The row is empty.');
                }
                FAQ__c record = FAQService.recordFromImport(
                    rows[indexValue].question,
                    rows[indexValue].answer,
                    rows[indexValue].category,
                    rows[indexValue].published,
                    rows[indexValue].displayOrder
                );
                records.add(record);
                sourceRows.add(indexValue + 2);
                questions.add(record.Question__c);
            } catch (AuraHandledException error) {
                result.failed++;
                result.errors.add('Row ' + (indexValue + 2) + ': ' + error.getMessage());
            }
        }

        Map<String, FAQ__c> existingByQuestion = new Map<String, FAQ__c>();
        if (!questions.isEmpty()) {
            for (FAQ__c existing : [
                SELECT Id, Question__c
                FROM FAQ__c
                WHERE Question__c IN :questions
                WITH USER_MODE
            ]) {
                existingByQuestion.put(existing.Question__c.toLowerCase(), existing);
            }
        }
        Set<String> seenQuestions = new Set<String>();
        for (Integer indexValue = 0; indexValue < records.size(); indexValue++) {
            String key = records[indexValue].Question__c.toLowerCase();
            if (existingByQuestion.containsKey(key) || seenQuestions.contains(key)) {
                result.warnings.add(
                    'Row ' + sourceRows[indexValue] +
                    ': A FAQ with a similar question already exists.'
                );
            }
            seenQuestions.add(key);
        }

        if (records.isEmpty()) {
            return result;
        }
        SObjectAccessDecision decision = Security.stripInaccessible(
            AccessType.CREATABLE,
            records
        );
        if (!decision.getRemovedFields().isEmpty()) {
            throw new AuraHandledException('You do not have access to all FAQ fields.');
        }
        Database.SaveResult[] saveResults = Database.insert(
            (List<FAQ__c>) decision.getRecords(),
            false,
            AccessLevel.USER_MODE
        );
        for (Integer indexValue = 0; indexValue < saveResults.size(); indexValue++) {
            if (saveResults[indexValue].isSuccess()) {
                result.inserted++;
            } else {
                result.failed++;
                for (Database.Error error : saveResults[indexValue].getErrors()) {
                    result.errors.add(
                        'Row ' + sourceRows[indexValue] + ': ' + error.getMessage()
                    );
                }
            }
        }
        return result;
    }

    /**
     * Returns the FAQ category picklist options.
     *
     * @return Active picklist values.
     */
    @AuraEnabled(cacheable=true)
    public static List<String> getCategoryValues() {
        requireAdmin();
        List<String> values = new List<String>();
        for (Schema.PicklistEntry entry : FAQ__c.Category__c.getDescribe().getPicklistValues()) {
            if (entry.isActive()) {
                values.add(entry.getValue());
            }
        }
        return values;
    }

    private static void requireAdmin() {
        if (!FeatureManagement.checkPermission('FAQ_Admin_Access')) {
            throw new AuraHandledException('Not authorized');
        }
    }
}
