# Code Generation Plan (single unit: storefront)

Inputs: specs.md, app-architecture.md, business-rules.md, business-logic-model.md, domain-entities.md. User Stories were skipped, so files map to FR-1..FR-5.

## Steps
- [x] 1. Server config (package.json, tsconfig) - all FRs
- [x] 2. Server seed data, model, errors, repository, service, controller, routes, middleware, app, index - FR-1, FR-2, FR-5
- [x] 3. Server API tests - FR-5
- [x] 4. Client config (package.json, tsconfig, vite.config, index.html) with /api proxy
- [x] 5. Client types, API client, format util - FR-1, FR-2
- [x] 6. Cart logic, provider, tests - FR-3, FR-4
- [x] 7. Components and pages - FR-1, FR-2, FR-3
- [x] 8. Styles - all UI
- [x] 9. README, .gitignore
- [ ] 10. Install, typecheck, build, test
- [ ] 11. Start both servers and exercise the API through the proxy

## File to Story Map
| File | Requirement |
|---|---|
| code/.gitignore, code/README.md | all |
| code/server/package.json, tsconfig.json | all |
| code/server/src/data/products.json | FR-1, FR-5 |
| code/server/src/models/product.ts | FR-5 |
| code/server/src/errors.ts | FR-5 |
| code/server/src/repositories/productRepository.ts | FR-5 |
| code/server/src/services/productService.ts | FR-5 |
| code/server/src/controllers/productController.ts | FR-5 |
| code/server/src/routes/productRoutes.ts | FR-5 |
| code/server/src/middleware/errorMiddleware.ts | FR-5 |
| code/server/src/app.ts, index.ts | FR-5 |
| code/server/tests/api.test.ts | FR-5 |
| code/client/package.json, tsconfig.json, vite.config.ts, index.html | all |
| code/client/src/main.tsx, App.tsx, types.ts, styles.css | all |
| code/client/src/api/client.ts | FR-1, FR-2 |
| code/client/src/utils/format.ts | FR-3 |
| code/client/src/cart/cartLogic.ts, CartProvider.tsx | FR-3, FR-4 |
| code/client/src/components/Layout.tsx, ProductCard.tsx, States.tsx | FR-1, FR-2, FR-3 |
| code/client/src/pages/CatalogPage.tsx | FR-1 |
| code/client/src/pages/ProductDetailPage.tsx | FR-2 |
| code/client/src/pages/CartPage.tsx | FR-3 |
| code/client/tests/cartLogic.test.ts | FR-3, FR-4 |
