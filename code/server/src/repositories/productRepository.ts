import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { Product } from '../models/product.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(here, '../../src/data/products.json');

export class ProductRepository {
  private products: Product[];

  constructor(products?: Product[]) {
    this.products = products ?? (JSON.parse(readFileSync(dataFile, 'utf-8')) as Product[]);
  }

  findAll(): Product[] {
    return [...this.products];
  }

  findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
