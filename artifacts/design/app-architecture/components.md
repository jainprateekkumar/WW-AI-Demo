# Components

Single unit: React + TypeScript SPA (`frontend`) and Express + TypeScript API (`backend`). Decisions: Context+useReducer cart, React Router pages, layered backend.

## Frontend
| Component | Responsibility |
|---|---|
| App / Router | Routes `/` (catalog), `/products/:id` (detail), `/cart`; hosts layout |
| Layout (Header, Footer) | Nav, cart badge with item count |
| CatalogPage | Fetch and list products in a responsive grid; loading/empty/error states |
| ProductCard | Image, name, price, link to detail, quick add |
| ProductDetailPage | Fetch one product; show details; Add to Cart; 404 state |
| CartPage | Line items, quantity controls, remove, line and cart totals, empty state |
| CartProvider (Context + useReducer) | Cart state, actions, localStorage persistence (FR-4) |
| ApiClient | Typed `fetch` wrapper for `/api/products` |
| UI primitives | Button, Spinner, EmptyState, ErrorState, QuantityStepper |

## Backend
| Component | Responsibility |
|---|---|
| ProductRoutes | Maps `GET /api/products`, `GET /api/products/:id` |
| ProductController | HTTP handling, param validation, status codes |
| ProductService | Product retrieval logic, not-found handling |
| ProductRepository | Loads seed JSON into memory; read-only lookups |
| ErrorMiddleware | Uniform JSON errors (404, 400, 500) |
| Seed data (`products.json`) | 8-12 sample products |
