# Unit Test Instructions

- Server: `cd code/server && npm test` runs the API tests (list, get by id, 404 error shape).
- Client: `cd code/client && npm test` runs the cart logic tests (add/increment cap at 10, decrement removes, paise totals, corrupt storage discarded, invalid lines dropped, dedupe).
