import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, fetchProduct } from '../api/client';
import { MAX_QTY } from '../cart/cartLogic';
import { useCart } from '../cart/CartProvider';
import { EmptyState, ErrorState, Spinner } from '../components/States';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';

export default function ProductDetailPage() {
  const { id = '' } = useParams();
  const { lines, dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [added, setAdded] = useState(false);

  const load = useCallback(() => {
    setError(null);
    setProduct(null);
    fetchProduct(id).then(setProduct, (e: ApiError) => setError(e));
  }, [id]);

  useEffect(load, [load]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  if (error?.status === 404)
    return (
      <EmptyState title="Product not found">
        <Link className="btn btn-outline" to="/">Back to shop</Link>
      </EmptyState>
    );
  if (error) return <ErrorState message={error.message} onRetry={load} />;
  if (!product) return <Spinner />;

  const qty = lines.find((l) => l.productId === product.id)?.quantity ?? 0;
  const atMax = qty >= MAX_QTY;

  return (
    <section>
      <Link to="/" className="back">&larr; Back to shop</Link>
      <div className="detail">
        <img className="detail-img" src={product.imageUrl} alt={product.name} />
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="price price-lg">{formatPrice(product.price)}</p>
          <p className="detail-desc">{product.description}</p>
          <button
            className="btn btn-primary"
            disabled={atMax}
            onClick={() => {
              dispatch({ type: 'ADD', product });
              setAdded(true);
            }}
          >
            {atMax ? 'Maximum 10 per item' : 'Add to cart'}
          </button>
          {added && <p className="notice notice-success" role="status">Added to cart</p>}
          {qty > 0 && !added && (
            <p className="muted">
              {qty} in your cart. <Link to="/cart">View cart</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
