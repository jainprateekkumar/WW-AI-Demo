import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import { ProductController } from './controllers/productController.js';
import { errorMiddleware, notFoundHandler } from './middleware/errorMiddleware.js';
import { ProductRepository } from './repositories/productRepository.js';
import { productRoutes } from './routes/productRoutes.js';
import { ProductService } from './services/productService.js';

export function createApp(repo: ProductRepository = new ProductRepository()): Express {
  const app = express();
  app.use(cors());
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  const controller = new ProductController(new ProductService(repo));
  app.use('/api/products', productRoutes(controller));
  app.use(notFoundHandler);
  app.use(errorMiddleware);
  return app;
}
