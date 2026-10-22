# React Client Functional Design

## Component Structure

- **App shell**: retains current header, brand, connection indicator, page heading, two-column responsive layout, and footer.
- **Public-data notice**: directly above the form: "Public demo. Entries are visible to anyone; use synthetic data only." Remove the inaccurate "Saved to your local records" copy. This is a behavior/transparency update, not a visual redesign.
- **Entry form**: preserve name/email/message labels, native required/type constraints, max lengths, count, submit button, busy label, inline success and form errors.
- **Entry collection**: count, refresh button, loading state, newest-first list, and empty state. Add a distinct load-error state so failed retrieval is never shown as an empty collection.
- **Entry row**: name, locale-formatted UTC date, mailto address, message, and stable ID key as today.

## State

- `form`: name/email/message. Clear only after confirmed HTTP 201 and valid response JSON. Retain values on network, validation, 5xx, and malformed-response failures.
- `entries`: last confirmed GET array plus a successfully returned POST entry. API order is newest first; successful POST prepends entry.
- `apiState`: loading, ready, or error for initial/last collection load and connection indicator.
- `isRefreshing`: disable refresh while a GET is in flight; an error state leaves it available for retry.
- `isSaving`: disable submit while POST is in flight; do not auto-retry ambiguous failures.
- `error`: form/save error (role=alert) or a collection-specific error presentation; do not present empty-state copy on a failed initial GET.
- `notice`: confirmation after a parsed 201 entry only (role=status).

## Request Contract and Flows

- GET `/api/entries`, no body: require successful JSON array. On initial failure, show a visible collection error with manual refresh retry. On refresh failure, keep any previously loaded entries and show failure feedback; never clear confirmed data.
- POST `/api/entries`, JSON `{name,email,message}`: show saving state, parse API `errors` or `title`, and announce failures accessibly. On confirmed 201 with valid entry, prepend newest item, clear form, and announce success. Do not submit server-controlled id/time.
- Keep relative same-origin paths. Local Vite proxy points to local FastAPI; production CloudFront `/api/*` sends the same paths to API Gateway. No endpoint secret, browser credentials, or CORS dependency.
- Do not automatically retry POST. An ambiguous network timeout may occur after a durable server write; never claim that the entry definitely was not saved.

## Validation and Accessibility

- Native controls remain aligned with current 100/200/2000 character limits, required fields, and email type. They improve usability but server validation is authoritative.
- Preserve labels, `aria-label` and title for refresh, `role=alert` on failures, `role=status` on loading/success, semantic ordered list/article/time, visible focus, and keyboard submission.
- API validation errors are field-keyed; current client may flatten messages. Avoid adding a second browser-only validation policy that contradicts server results.

## State Coverage

| Condition                             | Collection panel                               | Form                                       |
| ------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| Initial GET                           | Loading status                                 | Available with public-data notice          |
| Successful empty GET                  | Deliberate empty state                         | Available                                  |
| Successful populated GET              | Newest-first entries                           | Available                                  |
| Initial GET failure                   | Distinct error and manual refresh              | Error alert visible; preserve entered data |
| Refresh failure with existing entries | Keep previous entries and show refresh failure | Preserve current values                    |
| POST in progress                      | Current collection remains visible             | Disable submit and show busy label         |
| POST validation/storage failure       | Current collection remains visible             | Error alert; preserve input                |
| POST confirmed success                | Prepend returned entry                         | Clear inputs and announce confirmation     |

Real browser behavior and desktop/mobile layout remain Verify gates; this design claims no screenshot or runtime verification.
