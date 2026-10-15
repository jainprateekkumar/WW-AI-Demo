# Build Instructions

Prerequisites: Node.js 20+, npm.

1. Server: `cd code/server && npm install && npm run typecheck && npm run build`
2. Client: `cd code/client && npm install && npm run build` (runs `tsc --noEmit` then `vite build`)
3. Run locally: `npm run dev` in `code/server` (port 3001), then `npm run dev` in `code/client` (port 5173, `/api` proxied to 3001).
4. Open http://localhost:5173.
