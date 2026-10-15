# Services

## Backend: ProductService
- Orchestrates ProductRepository for read-only product access.
- `listProducts` returns all products; `getProduct` returns one or throws NotFoundError, which ErrorMiddleware maps to 404.
- Controllers contain no data logic; repositories contain no HTTP concerns.

## Frontend: Cart service (CartProvider)
- Single source of truth for cart state via Context + useReducer.
- Hydrates from localStorage on mount; writes on every state change.
- Exposes actions and derived totals to pages via a `useCart()` hook.

## Frontend: ApiClient
- Only module that calls the backend; handles JSON parsing and error mapping.

## Orchestration flows
- Browse: CatalogPage -> ApiClient -> `/api/products` -> Controller -> Service -> Repository.
- Add to cart: ProductDetailPage/ProductCard -> `useCart().addItem` -> reducer -> localStorage.
