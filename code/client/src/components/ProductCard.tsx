import { Link } from 'react-router-dom';
import { MAX_QTY } from '../cart/cartLogic';
import { useCart } from '../cart/CartProvider';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product }: { product: Product }) {
  const { lines, dispatch } = useCart();
  const qty = lines.find((l) => l.productId === product.id)?.quantity ?? 0;
  const atMax = qty >= MAX_QTY;
  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card-media">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="card-desc">{product.description}</p>
        <div className="card-foot">
          <span className="price">{formatPrice(product.price)}</span>
          <button
            className="btn btn-primary btn-sm"
            disabled={atMax}
            onClick={() => dispatch({ type: 'ADD', product })}
          >
            {atMax ? 'Max reached' : qty > 0 ? `Add more (${qty})` : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
