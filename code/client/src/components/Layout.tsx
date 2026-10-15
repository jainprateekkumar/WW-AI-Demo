import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCart } from '../cart/CartProvider';

export default function Layout() {
  const { itemCount } = useCart();
  return (
    <div className="shell">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span> Shopwise
          </Link>
          <nav className="nav">
            <NavLink to="/" end>Shop</NavLink>
            <NavLink to="/cart" className="cart-link" aria-label={`Cart, ${itemCount} items`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              Cart
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">Shopwise demo store. Prices in INR.</div>
      </footer>
    </div>
  );
}
