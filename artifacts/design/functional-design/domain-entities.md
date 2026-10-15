# Domain Entities

## Product (server, read-only)
| Field | Type | Notes |
|---|---|---|
| id | string | unique, stable |
| name | string | non-empty |
| description | string | |
| price | number | INR, whole rupees or up to 2 decimals; > 0 |
| imageUrl | string | |

Note: this supersedes the USD price note in app-architecture.md. All prices are INR.

## CartLine (client)
| Field | Type | Notes |
|---|---|---|
| productId | string | references Product.id |
| name | string | snapshot at add time |
| price | number | INR snapshot at add time |
| imageUrl | string | snapshot |
| quantity | integer | 1..10 |

## Cart (client)
- `lines: CartLine[]`, at most one line per productId.
- Derived: `itemCount` = sum of quantities; `subtotalPaise` = sum(round(price*100) * quantity).
- Persisted in localStorage under key `cart.v1` as `{ version: 1, lines }`.

## Error (API)
`{ error: { message: string, status: number } }`

## Relationships
Cart 1..* CartLine; CartLine -> Product by productId (soft reference; product may disappear).
