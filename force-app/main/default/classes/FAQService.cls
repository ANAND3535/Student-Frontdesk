/**
 * Shared FAQ validation and duplicate-warning logic.
 */
public with sharing class FAQService {
    private static final Set<String> CATEGORIES = new Set<String>{
        'General', 'Account', 'Billing', 'Technical', 'Other'
    };

    /**
     * Trims and validates an FAQ before it is persisted.
     *
     * @param faq FAQ record being normalized.
     */
    public static void normalizeAndValidate(FAQ__c faq) {
        if (faq == null) {
            throw new AuraHandledException('A FAQ record is required.');
        }
        faq.Question__c = faq.Question__c == null ? null : faq.Question__c.trim();
        faq.Answer__c = faq.Answer__c == null ? null : faq.Answer__c.trim();

        if (String.isBlank(faq.Question__c)) {
            throw new AuraHandledException('Enter a question.');
        }
        if (String.isBlank(faq.Answer__c) || !hasAnswerText(faq.Answer__c)) {
            throw new AuraHandledException('Enter an answer.');
        }
        if (faq.Question__c.length() > 255) {
            throw new AuraHandledException('Question must be 255 characters or fewer.');
        }
        if (faq.Category__c != null && !CATEGORIES.contains(faq.Category__c)) {
            throw new AuraHandledException('Choose a valid FAQ category.');
        }
    }

    /**
     * Reports an existing case-insensitive duplicate without blocking a save.
     *
     * @param question Question to compare.
     * @param excludedId Existing record to exclude when editing.
     * @return A warning string, or null when no duplicate exists.
     */
    public static String duplicateWarning(String question, Id excludedId) {
        if (String.isBlank(question)) {
            return null;
        }
        List<FAQ__c> matches = [
            SELECT Id
            FROM FAQ__c
            WHERE Question__c = :question
            AND Id != :excludedId
            WITH USER_MODE
            LIMIT 1
        ];
        return matches.isEmpty()
            ? null
            : 'A FAQ with a similar question already exists.';
    }

    /**
     * Validates a CSV row and constructs the corresponding FAQ record.
     *
     * @param question Question text.
     * @param answer Answer text.
     * @param category Category label.
     * @param published Whether the FAQ should be published.
     * @param displayOrder Optional display order.
     * @return A normalized FAQ record.
     */
    public static FAQ__c recordFromImport(
        String question,
        String answer,
        String category,
        Boolean published,
        Decimal displayOrder
    ) {
        FAQ__c faq = new FAQ__c(
            Question__c = question,
            Answer__c = answer,
            Category__c = String.isBlank(category) ? 'General' : category.trim(),
            Is_Published__c = published == null ? false : published,
            Display_Order__c = displayOrder == null ? 100 : displayOrder
        );
        normalizeAndValidate(faq);
        return faq;
    }

    private static Boolean hasAnswerText(String answer) {
        String plainText = answer.stripHtmlTags()
            .replaceAll('(?i)&nbsp;|&#160;|&#xA0;', '')
            .replace('\u00a0', '')
            .trim();
        return !String.isBlank(plainText);
    }
}
