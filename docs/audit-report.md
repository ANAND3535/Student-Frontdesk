# New org audit

Initial comparison was performed against the empty new Developer Edition org before
building the portal. Local source initially contained only the generated Salesforce
DX scaffold; the previous org was not accessed.

| Area | Local before build | New org before build | Outcome |
|---|---|---|---|
| Org | Empty scaffold | Developer Edition, alias `faqorg2` | Verified |
| Digital Experiences | No FAQ sources | No Network; disabled | Enabled and configured |
| FAQ object | Missing | Missing | `FAQ__c`, requested fields, rule, views, and tab deployed |
| Security | Missing | Missing | Custom permission and permission set deployed; assigned to current user |
| Apex | Missing | Missing | Public/admin controllers, service, and tests deployed |
| LWC | All five missing | All five missing | Home, FAQ, Admin, form, and CSV import deployed |
| Experience site | Missing | No site | LWR FAQ Portal created, routes configured, guest profile restricted, activated and published |
| FAQ data | No seed data | 0 published FAQs | 12 published sample FAQs seeded; seed script and CSV template prepared |

The initial `Network` query was unavailable until Digital Experiences was enabled.
The new org was verified as Developer Edition using `Organization.OrganizationType`.
Final verification confirmed Network status `Live`, the publish job completed, and
the Home and FAQ routes return HTTP 200. The login-required Admin route redirects
anonymous visitors to sign-in.
