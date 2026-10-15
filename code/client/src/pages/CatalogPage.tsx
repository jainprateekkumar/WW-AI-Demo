import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../api/client';
import ProductCard from '../components/ProductCard';
import { EmptyState, ErrorState } from '../components/States';
import type { Product } from '../types';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(() => {
    setError(null);
    setProducts(null);
    fetchProducts().then(setProducts, (e: Error) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products ?? []).filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [products, query]);

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Shop all products</h1>
          <p className="muted">Everyday essentials, simply priced.</p>
        </div>
        <input
          className="input"
          type="search"
          placeholder="Search products"
          aria-label="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {!products ? (
        <div className="grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="card skeleton" aria-hidden="true" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No products match your search">
          <p>Try a different keyword.</p>
          <button className="btn btn-outline" onClick={() => setQuery('')}>
            Clear search
          </button>
        </EmptyState>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
