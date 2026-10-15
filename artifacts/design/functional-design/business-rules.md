# Business Rules

## Cart
- BR-1 Quantity range per line is 1 to 10 inclusive.
- BR-2 Adding a product already in the cart increases that line's quantity by 1, capped at 10. At the cap, the add is ignored and the UI shows a "Maximum 10 per item" message.
- BR-3 Incrementing is capped at 10; the increment control is disabled at 10.
- BR-4 Decrementing a line at quantity 1 removes the line automatically (no confirmation).
- BR-5 An explicit Remove button also removes a line; Clear cart empties it.
- BR-6 A cart never holds two lines for the same productId.

## Pricing
- BR-7 All prices are INR. Display with `Intl.NumberFormat('en-IN', {style:'currency', currency:'INR'})`.
- BR-8 Totals are computed in integer paise (round(price*100)) and converted for display, avoiding float errors.
- BR-9 Line total = unit price x quantity. Subtotal = sum of line totals. No tax, shipping, or checkout.

## Persistence and stale data
- BR-10 The cart is saved to localStorage on every change.
- BR-11 On load, if stored JSON is missing, unparseable, wrong version, or fails shape validation, it is silently discarded and the cart starts empty.
- BR-12 Individually invalid lines (bad types, quantity outside 1..10 is clamped to the range, missing fields) are dropped; valid lines are kept as stored.
- BR-13 Stored lines are not revalidated against the API at load. On the cart page, a line whose product lookup returns 404 is flagged "No longer available" with a notice and a Remove action; the stored snapshot is still shown.

## Catalog
- BR-14 The product list supports a text search by name: case-insensitive, trimmed, substring match, filtered on the client. Empty query shows all.
- BR-15 No matches shows a designed empty state with a "clear search" action.

## API
- BR-16 Unknown product id returns 404 with the standard error shape. Unexpected errors return 500 with a generic message.
