# Functional Design Plan (single unit)

## Steps
- [x] Analyze unit context (specs.md, app-architecture.md)
- [x] Answer clarifying questions below
- [x] Generate domain-entities.md
- [x] Generate business-rules.md
- [x] Generate business-logic-model.md
- [x] UI component behavior is covered inside business-logic-model.md (flows); no separate file, as it is outside the Design manifest

## Decisions (from answers)
1. Quantity 1..10. 2. Decrement below 1 removes the line. 3. Re-adding increments. 4. Corrupt data discarded; unavailable products flagged on the cart page. 5. Prices in INR (overrides the USD note in app-architecture.md). 6. Text search by name.

## Questions (answered)
Q1 A; Q2 B; Q3 A; Q4 A; Q5 INR (integer paise computation); Q6 B.
