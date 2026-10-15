import { NotFoundError } from '../errors.js';
import type { Product } from '../models/product.js';
import type { ProductRepository } from '../repositories/productRepository.js';

export class ProductService {
  constructor(private repo: ProductRepository) {}

  list(): Product[] {
    return this.repo.findAll();
  }

  getById(id: string): Product {
    const product = this.repo.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }
}
