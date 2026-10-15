# Shopwise - basic e-commerce site

React + TypeScript (Vite) frontend and Express + TypeScript backend.

## Run
```
cd server && npm install && npm run dev     # http://localhost:3001
cd client && npm install && npm run dev     # http://localhost:5173 (proxies /api to 3001)
```

## Test / build
```
cd server && npm test && npm run typecheck && npm run build
cd client && npm test && npm run build
```

Cart is client-side only (localStorage); no checkout. Prices are in INR.
