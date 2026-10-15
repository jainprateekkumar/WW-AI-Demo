import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('products API', () => {
  it('lists products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('price');
  });

  it('gets a product by id', async () => {
    const res = await request(app).get('/api/products/p1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('p1');
  });

  it('returns 404 with standard error shape for unknown id', async () => {
    const res = await request(app).get('/api/products/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { message: 'Product not found', status: 404 } });
  });
});
