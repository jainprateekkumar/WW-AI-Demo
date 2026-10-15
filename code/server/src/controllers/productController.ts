import type { NextFunction, Request, Response } from 'express';
import type { ProductService } from '../services/productService.js';

export class ProductController {
  constructor(private service: ProductService) {}

  list = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json(this.service.list());
    } catch (e) {
      next(e);
    }
  };

  get = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json(this.service.getById(req.params.id));
    } catch (e) {
      next(e);
    }
  };
}
