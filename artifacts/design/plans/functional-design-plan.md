# Functional Design Plan (single unit)

## Steps
- [ ] Analyze unit context (specs.md, app-architecture.md)
- [ ] Answer clarifying questions below
- [ ] Generate domain-entities.md
- [ ] Generate business-rules.md
- [ ] Generate business-logic-model.md
- [ ] Generate frontend-components.md

## Questions

## Question 1
How should the cart handle quantity limits per line item?

A) Minimum 1, maximum 10 per item

B) Minimum 1, no maximum

C) Minimum 1, maximum 99 per item

D) Other (please describe after [Answer]: tag below)

[Answer]: A) Minimum 1, maximum 10 per item

## Question 2
What should happen when the user decrements a cart item's quantity below 1?

A) Clamp at 1; removal only through an explicit Remove button

B) Remove the item automatically

C) Ask for confirmation, then remove

D) Other (please describe after [Answer]: tag below)

[Answer]: B) Remove the item automatically

## Question 3
What should happen when the same product is added to the cart again?

A) Increase the existing line's quantity by 1

B) Add a separate line item

C) Other (please describe after [Answer]: tag below)

[Answer]: A) Increase the existing line's quantity by 1

## Question 4
How should stale localStorage cart data be handled (e.g. a product no longer exists, or the stored JSON is corrupt)?

A) Discard corrupt data silently; keep lines as stored and show a notice for unavailable products on the cart page

B) Discard corrupt data silently; revalidate lines against the API and drop unavailable products with a notice

C) Always trust stored data without validation

D) Other (please describe after [Answer]: tag below)

[Answer]: A) Discard corrupt data silently; keep lines as stored and show a notice for unavailable products on the cart page

## Question 5
How should prices be displayed and computed?

A) Store prices as numbers in USD; format with Intl.NumberFormat; compute totals in integer cents to avoid rounding errors

B) Store prices as numbers; sum as plain floats and format to 2 decimals

C) Other (please describe after [Answer]: tag below)

[Answer]: use in INR

## Question 6
Which catalog features should the product list include?

A) Plain listing only

B) Listing plus a simple text search by name

C) Listing plus search and category filter

D) Other (please describe after [Answer]: tag below)

[Answer]: B) Listing plus a simple text search by name
