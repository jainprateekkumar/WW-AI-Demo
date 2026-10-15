# Business Logic Model

## Cart reducer actions
| Action | Logic |
|---|---|
| ADD(product) | If line exists: quantity = min(quantity+1, 10); else append line with quantity 1 and snapshot fields |
| INCREMENT(id) | quantity = min(quantity+1, 10) |
| DECREMENT(id) | if quantity > 1: quantity-1; else remove line |
| REMOVE(id) | remove line |
| CLEAR | lines = [] |
| HYDRATE(lines) | replace state with validated stored lines |

## Initialization
1. Read `cart.v1` from localStorage (try/catch).
2. Parse JSON; check `version === 1` and `lines` is an array.
3. Filter each line by shape; clamp quantity to 1..10; dedupe by productId (keep first).
4. On any failure, start with an empty cart.
5. After every state change, write `{version:1, lines}` back (failures to write are ignored and do not break the UI).

## Derived values
- itemCount = sum(quantity)
- lineTotalPaise = round(price*100) * quantity
- subtotalPaise = sum(lineTotalPaise)
- Display = paise / 100 formatted as INR.

## Flows
- Catalog: fetch GET /api/products -> loading skeleton -> list; error state with retry; filter by search query client-side; empty state if none.
- Product detail: fetch GET /api/products/:id -> loading / 404 "Product not found" / detail with Add to cart (shows confirmation feedback; at cap shows max message).
- Cart page: render lines from state; for each distinct productId fetch product availability (GET /api/products/:id); 404 marks the line unavailable with a notice; other fetch errors are ignored (line shown normally). Empty cart shows an empty state linking to the catalog.
- Header cart badge shows itemCount.

## Backend
Route -> controller -> service.list()/getById(id) -> repository over seed products.json loaded at startup. Missing id throws NotFoundError, mapped by ErrorMiddleware to 404.
