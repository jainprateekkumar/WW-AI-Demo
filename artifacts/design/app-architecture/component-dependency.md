# Component Dependencies

## Dependency matrix (row depends on column)
| | ApiClient | CartProvider | ProductController | ProductService | ProductRepository |
|---|---|---|---|---|---|
| CatalogPage | X | X (via ProductCard) | | | |
| ProductDetailPage | X | X | | | |
| CartPage | | X | | | |
| Layout | | X | | | |
| ApiClient | | | X (HTTP) | | |
| ProductController | | | | X | |
| ProductService | | | | | X |

## Communication
- Frontend to backend: HTTP/JSON over REST. Dev: Vite proxies `/api` to the Express port (backend 3001, frontend 5173).
- Frontend pages share cart state only through CartProvider context.
- Backend is strictly layered: routes -> controller -> service -> repository. No upward dependencies.

## Data flow
```
Browser -> React page -> ApiClient --/api--> Routes -> Controller -> Service -> Repository -> products.json (memory)
                  |
                  +-> CartProvider <-> localStorage
```
