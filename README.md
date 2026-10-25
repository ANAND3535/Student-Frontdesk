# Salesforce FAQ Portal

## Architecture

```text
Public visitor
    |
    v
Experience Cloud LWR: Home (/) ---> faqHome
    |                                  |-- FAQ (/faq) ---> faqList
    |                                  `-- Admin (/admin, login required) ---> faqAdmin
    |                                                                       |-- faqAdminForm
    |                                                                       `-- faqCsvImport
    v
FAQPublicController (read-only, published records only)

Authenticated FAQ administrator
    |
    v
FAQAdminController -- FAQ_Admin_Access custom permission -- FAQ_Admin permission set
    |
    v
FAQ__c (Private sharing; Question, Answer, Category, Published, Display Order)
```

The guest profile has Apex access only to `FAQPublicController`; it has no `FAQ__c`
object permissions. The public controller runs read-only in system context, selects
fixed FAQ fields, filters to published rows, orders them, and caps responses at 500.
Admin controller queries and DML use user mode and `Security.stripInaccessible`.

## Salesforce metadata

- `FAQ__c` uses an auto-number name (`FAQ-{0000}`) and Private sharing.
- Required question and rich-text answer fields are validated by object metadata and
  `FAQService`; categories are General, Account, Billing, Technical, and Other.
- Salesforce does not allow the `required` attribute on an HTML (rich-text) field.
  The answer is therefore enforced by the validation rule, admin form, and Apex
  service, including whitespace-only content.
- `FAQ_Admin_Access` gates writes. `FAQ_Admin` grants FAQ CRUD/field access, Apex
  class access, the custom permission, and the FAQ tab.
- `FAQPublicController` serves public FAQ cards. `FAQAdminController` handles
  authorized search, save, publication, delete, category, and partial CSV import.
  `FAQService` trims/validates records and reports case-insensitive duplicate
  warnings. `FAQPortalTest` covers guest/public filtering and admin access/workflows.

## Components

- `faqHome`: Help Center hero and FAQ/Admin links.
- `faqList`: public search, category chips, accessible accordion, 60-second refresh.
- `faqAdmin`: access gate, search/filter, table, edit/delete/publish actions.
- `faqAdminForm`: validated FAQ editor.
- `faqCsvImport`: UTF-8 CSV parser, preview, row results, and template download.

## Live site

- Home: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/
- FAQ: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/faq
- Admin: https://orgfarm-0bc0fdebdb-dev-ed.develop.my.site.com/faqportal/admin
- Org alias: `faqorg2`

## Adding FAQs

1. Sign in to the Admin route as a Salesforce user assigned the `FAQ_Admin`
   permission set and granted access to the FAQ Portal site.
2. Select **New FAQ**, fill in the question and rich-text answer, choose a category
   and display order, then select **Published** if it should appear publicly.
3. To add multiple entries, choose **Import CSV**, download the template, fill the
   `Question,Answer,Category,Published` columns, upload it, inspect the preview,
   then select **Import**. Imports accept up to 2,000 rows and report row errors.
4. Public users can see only published answers on the FAQ route. The page refreshes
   periodically and when a visitor returns to the browser tab.

The import template is [data/faq-template.csv](./data/faq-template.csv). Seed data
can be loaded with `sf apex run --file scripts/apex/seed-faqs.apex --target-org faqorg2`;
the script inserts 12 example FAQs only when fewer than five published records exist.

## Deploy and test

```powershell
sf project deploy start --source-dir force-app --target-org faqorg2
sf apex run test --test-level RunLocalTests --code-coverage --result-format human --wait 15 --target-org faqorg2
sf community publish --name "FAQ Portal" --target-org faqorg2
```

For repeatable smoke checks, run
`sf apex run --file scripts/apex/verify-public-count.apex --target-org faqorg2`
and, as the assigned admin,
`sf apex run --file scripts/apex/verify-admin-flow.apex --target-org faqorg2`.

## Troubleshooting

- If the FAQ route is empty, verify records have **Published** selected and run
  `sf data query --query "SELECT COUNT() FROM FAQ__c WHERE Is_Published__c = true" --target-org faqorg2`.
- If the Admin route denies access, assign `FAQ_Admin` and confirm the site has the
  admin profile/permission set as members.
- If public FAQ loading fails, verify the site's guest profile grants Apex class
  access to `FAQPublicController`; do not grant guests CRUD on `FAQ__c`.
- For local LWC Jest tests and linting, install the project dependencies with
  `npm install`, then run `npm test` and `npm run lint`.
