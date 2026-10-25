@IsTest
private class FAQPortalTest {
    @TestSetup
    static void createUsers() {
        Profile profileRecord = [
            SELECT Id
            FROM Profile
            WHERE Name = 'Standard User'
            LIMIT 1
        ];
        String uniqueName = UserInfo.getOrganizationId() + '.faq@example.invalid';
        User adminUser = makeUser(profileRecord.Id, 'faqadmin', uniqueName);
        User regularUser = makeUser(
            profileRecord.Id,
            'faquser',
            UserInfo.getOrganizationId() + '.regular@example.invalid'
        );
        insert new List<User>{ adminUser, regularUser };

        PermissionSet adminPermission = [
            SELECT Id
            FROM PermissionSet
            WHERE Name = 'FAQ_Admin'
            LIMIT 1
        ];
        insert new PermissionSetAssignment(
            AssigneeId = adminUser.Id,
            PermissionSetId = adminPermission.Id
        );
    }

    @IsTest
    static void publicApiReturnsOnlyPublishedInOrder() {
        insert new List<FAQ__c>{
            faq('Later item', '<p>Second answer</p>', 'General', true, 20),
            faq('Hidden item', '<p>Not public</p>', 'General', false, 1),
            faq('First item', '<p>First answer</p>', 'General', true, 10)
        };

        Test.startTest();
        List<FAQDto> publicFaqs =
            FAQPublicController.getPublishedFaqs();
        Test.stopTest();

        System.assertEquals(2, publicFaqs.size());
        System.assertEquals('First item', publicFaqs[0].question);
        System.assertEquals('Later item', publicFaqs[1].question);
        System.assertEquals('<p>First answer</p>', publicFaqs[0].answer);
    }

    @IsTest
    static void administratorCanSavePublishSearchAndDelete() {
        User adminUser = getUser('faqadmin');
        System.runAs(adminUser) {
            System.assert(FAQAdminController.isAdmin());
            System.assertEquals(5, FAQAdminController.getCategoryValues().size());

            FAQSaveResult saved = FAQAdminController.saveFaq(
                new FAQ__c(
                    Question__c = '  How do I update my profile?  ',
                    Answer__c = '<p>Use settings.</p>',
                    Category__c = 'Account',
                    Display_Order__c = 25,
                    Is_Published__c = false
                )
            );
            System.assertEquals('How do I update my profile?', saved.faq.Question__c);
            System.assertEquals(1, FAQAdminController.getAllFaqs('profile').size());
            System.assertEquals(1, FAQAdminController.getAllFaqs(null).size());

            saved.faq.Question__c = 'How do I change my profile?';
            FAQSaveResult updated =
                FAQAdminController.saveFaq(saved.faq);
            System.assertEquals('How do I change my profile?', updated.faq.Question__c);
            System.assertEquals(0, FAQAdminController.getAllFaqs('no matching question').size());

            FAQAdminController.setPublished(saved.faq.Id, true);
            System.assertEquals(1, FAQPublicController.getPublishedFaqs().size());
            FAQAdminController.setPublished(saved.faq.Id, false);
            System.assertEquals(0, FAQPublicController.getPublishedFaqs().size());

            FAQAdminController.deleteFaq(saved.faq.Id);
            System.assertEquals(0, FAQAdminController.getAllFaqs(null).size());
        }
    }

    @IsTest
    static void duplicateQuestionProducesWarningAndInvalidInputIsRejected() {
        insert faq('Where is my invoice?', '<p>Check Billing.</p>', 'Billing', false, 100);
        User adminUser = getUser('faqadmin');
        System.runAs(adminUser) {
            FAQSaveResult duplicate = FAQAdminController.saveFaq(
                new FAQ__c(
                    Question__c = 'WHERE IS MY INVOICE?',
                    Answer__c = '<p>Contact Billing.</p>',
                    Category__c = 'Billing',
                    Is_Published__c = false
                )
            );
            System.assertNotEquals(null, duplicate.warning);

            Boolean rejected = false;
            try {
                FAQAdminController.saveFaq(
                    new FAQ__c(Question__c = '   ', Answer__c = '<p><br></p>')
                );
            } catch (AuraHandledException error) {
                rejected = true;
            }
            System.assert(rejected, 'Blank questions and answers must be rejected.');
        }
    }

    @IsTest
    static void importPartiallyInsertsAndReportsRowErrors() {
        User adminUser = getUser('faqadmin');
        System.runAs(adminUser) {
            List<FaqRow> rows =
                new List<FaqRow>();
            rows.add(importRow('How do I sign in?', '<p>Use your email.</p>', 'General'));
            rows.add(importRow('How can I pay?', '<p>Pay online.</p>', 'Billing'));
            rows.add(importRow(' ', '<p>Missing question.</p>', 'General'));
            rows.add(importRow('Whitespace answer?', '<p>&nbsp;</p>', 'General'));

            Test.startTest();
            FAQImportResult result =
                FAQAdminController.importFaqs(rows);
            Test.stopTest();

            System.assertEquals(2, result.inserted);
            System.assertEquals(2, result.failed);
            System.assertEquals(2, result.errors.size());
            System.assertEquals(2, FAQAdminController.getAllFaqs(null).size());
        }
    }

    @IsTest
    static void importWarnsOnExistingAndInBatchDuplicates() {
        insert faq('Where do I find receipts?', '<p>In Billing.</p>', 'Billing', false, 100);
        User adminUser = getUser('faqadmin');
        System.runAs(adminUser) {
            List<FaqRow> rows =
                new List<FaqRow>();
            rows.add(importRow('WHERE DO I FIND RECEIPTS?', '<p>Billing.</p>', 'Billing'));
            rows.add(importRow('How do I reset access?', '<p>Use the reset link.</p>', 'Account'));
            rows.add(importRow('HOW DO I RESET ACCESS?', '<p>Try the link.</p>', 'Account'));

            FAQImportResult result =
                FAQAdminController.importFaqs(rows);

            System.assertEquals(3, result.inserted);
            System.assertEquals(2, result.warnings.size());
        }
    }

    @IsTest
    static void nonAdministratorIsRejectedAndEmptyImportIsRejected() {
        User regularUser = getUser('faquser');
        System.runAs(regularUser) {
            System.assertEquals(false, FAQAdminController.isAdmin());
            Boolean accessDenied = false;
            try {
                FAQAdminController.getAllFaqs(null);
            } catch (AuraHandledException error) {
                accessDenied = true;
            }
            System.assert(accessDenied, 'A non-admin must not read admin records.');

            Boolean emptyRejected = false;
            try {
                FAQAdminController.importFaqs(new List<FaqRow>());
            } catch (AuraHandledException error) {
                emptyRejected = true;
            }
            System.assert(emptyRejected);
        }
    }

    @IsTest
    static void administratorInvalidInputsAreReported() {
        User adminUser = getUser('faqadmin');
        System.runAs(adminUser) {
            Boolean publishRejected = false;
            try {
                FAQAdminController.setPublished(null, true);
            } catch (AuraHandledException error) {
                publishRejected = true;
            }
            System.assert(publishRejected);

            Boolean deleteRejected = false;
            try {
                FAQAdminController.deleteFaq(null);
            } catch (AuraHandledException error) {
                deleteRejected = true;
            }
            System.assert(deleteRejected);

            Boolean nullImportRejected = false;
            try {
                FAQAdminController.importFaqs(null);
            } catch (AuraHandledException error) {
                nullImportRejected = true;
            }
            System.assert(nullImportRejected);

            List<FaqRow> tooManyRows =
                new List<FaqRow>();
            for (Integer indexValue = 0; indexValue < 2001; indexValue++) {
                tooManyRows.add(new FaqRow());
            }
            Boolean sizeRejected = false;
            try {
                FAQAdminController.importFaqs(tooManyRows);
            } catch (AuraHandledException error) {
                sizeRejected = true;
            }
            System.assert(sizeRejected);

            List<FaqRow> invalidRows =
                new List<FaqRow>{
                    new FaqRow(),
                    null
                };
            FAQImportResult result =
                FAQAdminController.importFaqs(invalidRows);
            System.assertEquals(0, result.inserted);
            System.assertEquals(2, result.failed);
            System.assertEquals(2, result.errors.size());
        }
    }

    private static User makeUser(Id profileId, String aliasValue, String usernameValue) {
        return new User(
            Alias = aliasValue,
            Email = usernameValue,
            EmailEncodingKey = 'UTF-8',
            LastName = aliasValue,
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            ProfileId = profileId,
            TimeZoneSidKey = 'America/Los_Angeles',
            Username = usernameValue
        );
    }

    private static User getUser(String aliasValue) {
        return [
            SELECT Id, Alias
            FROM User
            WHERE Alias = :aliasValue
            LIMIT 1
        ];
    }

    private static FAQ__c faq(
        String question,
        String answer,
        String category,
        Boolean published,
        Decimal displayOrder
    ) {
        return new FAQ__c(
            Question__c = question,
            Answer__c = answer,
            Category__c = category,
            Is_Published__c = published,
            Display_Order__c = displayOrder
        );
    }

    private static FaqRow importRow(
        String question,
        String answer,
        String category
    ) {
        FaqRow row = new FaqRow();
        row.question = question;
        row.answer = answer;
        row.category = category;
        row.published = true;
        row.displayOrder = 100;
        return row;
    }
}
