# Component Methods

Business rules are detailed in Functional Design.

## Shared types
```ts
interface Product { id: string; name: string; description: string; price: number; imageUrl: string }
interface CartItem { productId: string; name: string; price: number; imageUrl: string; quantity: number }
```

## Backend
| Component | Method | Input -> Output |
|---|---|---|
| ProductRepository | `findAll()` | -> `Product[]` |
| ProductRepository | `findById(id)` | `string` -> `Product \| undefined` |
| ProductService | `listProducts()` | -> `Product[]` |
| ProductService | `getProduct(id)` | `string` -> `Product`; throws NotFoundError |
| ProductController | `list(req,res)` | -> 200 `Product[]` |
| ProductController | `getById(req,res,next)` | -> 200 `Product` / 404 |
| ErrorMiddleware | `handle(err,req,res,next)` | -> JSON `{error:{message,status}}` |

## Frontend
| Component | Method | Input -> Output |
|---|---|---|
| ApiClient | `getProducts()` | -> `Promise<Product[]>` |
| ApiClient | `getProduct(id)` | -> `Promise<Product>` (rejects on 404) |
| CartProvider | `addItem(product, qty=1)` | -> void |
| CartProvider | `updateQuantity(productId, qty)` | -> void |
| CartProvider | `removeItem(productId)` | -> void |
| CartProvider | `clear()` | -> void |
| CartProvider | selectors `itemCount`, `cartTotal`, `lineTotal(item)` | -> number |
| Cart reducer | `cartReducer(state, action)` | pure state transition |
| Storage | `loadCart()` / `saveCart(items)` | localStorage read/write |
