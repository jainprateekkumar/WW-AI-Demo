import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, fetchProduct } from '../api/client';
import { MAX_QTY, lineTotalPaise } from '../cart/cartLogic';
import { useCart } from '../cart/CartProvider';
import { EmptyState } from '../components/States';
import { formatPaise, formatPrice } from '../utils/format';

export default function CartPage() {
  const { lines, subtotalPaise, itemCount, dispatch } = useCart();
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());

  const idsKey = lines.map((l) => l.productId).join('|');
  useEffect(() => {
    let cancelled = false;
    const ids = idsKey ? idsKey.split('|') : [];
    ids.forEach((id) => {
      fetchProduct(id).then(
        () => {
          if (!cancelled)
            setUnavailable((s) => {
              if (!s.has(id)) return s;
              const n = new Set(s);
              n.delete(id);
              return n;
            });
        },
        (e: unknown) => {
          if (!cancelled && e instanceof ApiError && e.status === 404)
            setUnavailable((s) => new Set(s).add(id));
        },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  if (lines.length === 0)
    return (
      <EmptyState title="Your cart is empty">
        <p>Looks like you haven't added anything yet.</p>
        <Link className="btn btn-primary" to="/">Start shopping</Link>
      </EmptyState>
    );

  return (
    <section>
      <div className="page-head">
        <h1>Your cart <span className="muted">({itemCount} items)</span></h1>
        <button className="btn btn-outline" onClick={() => dispatch({ type: 'CLEAR' })}>
          Clear cart
        </button>
      </div>
      <div className="cart-layout">
        <ul className="cart-list">
          {lines.map((l) => (
            <li key={l.productId} className={`cart-line ${unavailable.has(l.productId) ? 'is-unavailable' : ''}`}>
              <img src={l.imageUrl} alt={l.name} />
              <div className="cart-line-info">
                <Link to={`/products/${l.productId}`} className="cart-line-name">{l.name}</Link>
                <span className="muted">{formatPrice(l.price)} each</span>
                {unavailable.has(l.productId) && (
                  <span className="notice notice-warn">No longer available. Please remove it.</span>
                )}
              </div>
              <div className="qty" aria-label={`Quantity for ${l.name}`}>
                <button className="qty-btn" aria-label="Decrease quantity" onClick={() => dispatch({ type: 'DECREMENT', id: l.productId })}>-</button>
                <span>{l.quantity}</span>
                <button className="qty-btn" aria-label="Increase quantity" disabled={l.quantity >= MAX_QTY} onClick={() => dispatch({ type: 'INCREMENT', id: l.productId })}>+</button>
              </div>
              <strong className="line-total">{formatPaise(lineTotalPaise(l))}</strong>
              <button className="link-btn" onClick={() => dispatch({ type: 'REMOVE', id: l.productId })}>Remove</button>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal</span><strong>{formatPaise(subtotalPaise)}</strong></div>
          <p className="muted">Checkout is not available in this demo.</p>
          <p className="muted">Maximum 10 per item.</p>
        </aside>
      </div>
    </section>
  );
}
