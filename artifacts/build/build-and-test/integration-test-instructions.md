# Integration Test Instructions

Start both servers, then check through the Vite proxy:

1. `curl http://localhost:5173/api/products` returns 8 products.
2. `curl http://localhost:5173/api/products/p1` returns product p1.
3. `curl -i http://localhost:5173/api/products/nope` returns 404 with `{"error":{"message":"Product not found","status":404}}`.
4. In the browser: search the catalog, open a product, add it repeatedly (stops at 10), open the cart, change quantities, reload to confirm persistence, and set `cart.v1` to junk in localStorage to confirm it starts empty.
5. Add a line with a bogus productId to `cart.v1` and confirm the cart page flags "No longer available".
