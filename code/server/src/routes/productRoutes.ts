import { Router } from 'express';
import type { ProductController } from '../controllers/productController.js';

export function productRoutes(controller: ProductController): Router {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  return router;
}
