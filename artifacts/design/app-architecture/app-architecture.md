# Application Architecture

Source: specs.md and the answered architecture plan.

## Overview
Single-unit app: TypeScript React SPA (React Router) plus TypeScript Express REST API with in-memory data from seed JSON. Cart is client-side only (Context + useReducer, localStorage).

## Key decisions
- State: React Context + useReducer (no extra dependency)
- Routing: `/`, `/products/:id`, `/cart`
- Backend: layered routes -> controller -> service -> repository
- Language: TypeScript on both sides
- Dev wiring: backend 3001, Vite 5173 with `/api` proxy
- Styling: one consistent modern approach (decided at build), with designed loading/empty/error states

## Components
Frontend: App/Router, Layout, CatalogPage, ProductCard, ProductDetailPage, CartPage, CartProvider, ApiClient, UI primitives.
Backend: ProductRoutes, ProductController, ProductService, ProductRepository, ErrorMiddleware, products.json.

## API contract
- `GET /api/products` -> 200 `Product[]`
- `GET /api/products/:id` -> 200 `Product`; 404 `{error:{message,status}}`
- Product: `{id, name, description, price, imageUrl}` (price in USD as number)

## Dependencies and flow
Pages -> ApiClient -> API -> Controller -> Service -> Repository. Pages -> CartProvider -> localStorage. See component-dependency.md.

## Requirement coverage
FR-1 CatalogPage; FR-2 ProductDetailPage; FR-3 CartPage + CartProvider; FR-4 localStorage persistence; FR-5 product routes.

## Detail documents
components.md, component-methods.md, services.md, component-dependency.md.
