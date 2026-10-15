# Specification: Basic E-Commerce Site

## 1. Intent
Create a basic e-commerce site that lets shoppers browse products, view details, and manage a shopping cart. Workflow type: Simple.

## 2. Technology Stack
- Frontend: React (SPA)
- Backend: Node.js with Express (REST API)
- Data: In-memory store seeded from a JSON file (no database)

## 3. Functional Requirements
- FR-1: Product catalog page listing all products (image, name, price).
- FR-2: Product detail page (image, name, description, price, Add to Cart).
- FR-3: Shopping cart: add items, change quantity, remove items, view line totals and cart total.
- FR-4: Cart contents persist across page reloads (client-side storage, e.g. localStorage).
- FR-5: Backend exposes `GET /api/products` and `GET /api/products/:id`.

## 4. Out of Scope
- Checkout, payment (real or simulated), orders and order history
- User accounts / authentication
- Database persistence, admin product management

## 5. Non-Functional Requirements
- Responsive, polished UI (modern styling, designed empty/loading/error states).
- Local dev works out of the box (frontend proxies to backend, consistent ports).
- Basic input validation and error handling (e.g. unknown product returns 404).
- Seed data of roughly 8-12 sample products.

## 6. Assumptions
- Single currency (USD), no inventory tracking, no tax or shipping.
- Cart is client-side only; backend is read-only for products.

## 7. Traceability
Derived from the user request and the answered clarifying questions (Q1: React + Express, Q2: catalog/detail/cart without checkout, Q3: in-memory/JSON data).
