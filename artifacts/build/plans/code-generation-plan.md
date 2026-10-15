# Code Generation Plan (single unit: storefront)

Sources: specs.md, app-architecture.md, business-rules.md, business-logic-model.md, domain-entities.md.
User Stories were skipped, so the "User stories" column uses the functional requirements (FR-1 to FR-5) from specs.md.

## Context
- Greenfield, single unit. Code lives under `code/`: `code/server` (Express + TypeScript) and `code/client` (React + Vite + TypeScript).
- Dev wiring: server on 3001, Vite on 5173 with `/api` proxied to `http://localhost:3001`.
- Styling: Tailwind-free, one hand-written design-token CSS file (`styles.css`) with a type scale, spacing, color system, cards, button hierarchy, skeleton loaders, and designed empty/error states.
- Prices are INR (BR-7). Cart in Context + useReducer, persisted to localStorage `cart.v1`.
- API: `GET /api/products`, `GET /api/products/:id`, errors `{error:{message,status}}`.

## Steps
- [ ] Step 1: Project structure setup (root and per-app manifests, tsconfig, gitignore)
- [ ] Step 2: Backend business logic (ProductService, errors, types)
- [ ] Step 3: Backend business logic unit tests
- [ ] Step 4: Backend API layer (routes, controller, error middleware, app, index)
- [ ] Step 5: Backend API tests (supertest)
- [ ] Step 6: Backend repository and seed data (products.json)
- [ ] Step 7: Frontend core logic (money, cart reducer, storage, CartProvider, api client)
- [ ] Step 8: Frontend logic unit tests
- [ ] Step 9: Frontend components and pages (Layout, ProductCard, States, Catalog, Detail, Cart, styles)
- [ ] Step 10: Documentation (README, build summary)
- [ ] Step 11: Verification: install, typecheck/build, run both servers, exercise real API calls and the Vite proxy

## File to User Story Map

| File path | User stories |
|-----------|--------------|
| code/package.json | FR-1; FR-2; FR-3; FR-4; FR-5 |
| code/.gitignore | FR-1; FR-2; FR-3; FR-4; FR-5 |
| code/README.md | FR-1; FR-2; FR-3; FR-4; FR-5 |
| code/server/package.json | FR-5 |
| code/server/tsconfig.json | FR-5 |
| code/server/vitest.config.ts | FR-5 |
| code/server/src/types.ts | FR-5 |
| code/server/src/errors.ts | FR-5 |
| code/server/src/data/products.json | FR-1; FR-2; FR-5 |
| code/server/src/repositories/productRepository.ts | FR-1; FR-2; FR-5 |
| code/server/src/services/productService.ts | FR-1; FR-2; FR-5 |
| code/server/src/controllers/productController.ts | FR-1; FR-2; FR-5 |
| code/server/src/routes/productRoutes.ts | FR-1; FR-2; FR-5 |
| code/server/src/middleware/errorMiddleware.ts | FR-2; FR-5 |
| code/server/src/app.ts | FR-5 |
| code/server/src/index.ts | FR-5 |
| code/server/tests/productService.test.ts | FR-1; FR-2; FR-5 |
| code/server/tests/products.api.test.ts | FR-1; FR-2; FR-5 |
| code/client/package.json | FR-1; FR-2; FR-3; FR-4 |
| code/client/tsconfig.json | FR-1; FR-2; FR-3; FR-4 |
| code/client/vite.config.ts | FR-1; FR-2; FR-3; FR-4 |
| code/client/index.html | FR-1 |
| code/client/src/vite-env.d.ts | FR-1 |
| code/client/src/main.tsx | FR-1; FR-2; FR-3 |
| code/client/src/App.tsx | FR-1; FR-2; FR-3 |
| code/client/src/styles.css | FR-1; FR-2; FR-3 |
| code/client/src/types.ts | FR-1; FR-2; FR-3 |
| code/client/src/api/client.ts | FR-1; FR-2; FR-3 |
| code/client/src/utils/money.ts | FR-1; FR-2; FR-3 |
| code/client/src/cart/cartReducer.ts | FR-3 |
| code/client/src/cart/storage.ts | FR-4 |
| code/client/src/cart/CartProvider.tsx | FR-3; FR-4 |
| code/client/src/components/Layout.tsx | FR-1; FR-3 |
| code/client/src/components/ProductCard.tsx | FR-1 |
| code/client/src/components/States.tsx | FR-1; FR-2; FR-3 |
| code/client/src/pages/CatalogPage.tsx | FR-1 |
| code/client/src/pages/ProductDetailPage.tsx | FR-2; FR-3 |
| code/client/src/pages/CartPage.tsx | FR-3; FR-4 |
| code/client/tests/money.test.ts | FR-3 |
| code/client/tests/cartReducer.test.ts | FR-3 |
| code/client/tests/storage.test.ts | FR-4 |

Total planned code files: 40 (rows above: 40).
