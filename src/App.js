import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation
} from 'react-router-dom';

import Products from './pages/Products';
import Orders from './pages/Orders';

const navigationItems = [
  {
    to: '/',
    label: 'Products',
    description: 'Catalog and stock'
  },
  {
    to: '/orders',
    label: 'Orders',
    description: 'Fulfillment pipeline'
  }
];

function AppLayout() {
  const location = useLocation();

  const currentPage =
    navigationItems.find((item) => item.to === location.pathname) ||
    navigationItems[0];

  return (
    <div className="erp-shell">
      <aside className="erp-sidebar">
        <div>
          <div className="erp-brand">
            <div className="erp-brand-mark">
              ER
            </div>

            <div>
              <div className="erp-brand-title">
                ERP Control
              </div>

              <div className="erp-brand-subtitle">
                Operations dashboard
              </div>
            </div>
          </div>

          <div className="erp-sidebar-section-label">
            Navigation
          </div>

          <nav className="erp-nav">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `erp-nav-link ${isActive ? 'active' : ''}`
                }
                end={item.to === '/'}
              >
                <span className="erp-nav-link-title">
                  {item.label}
                </span>

                <span className="erp-nav-link-description">
                  {item.description}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="erp-sidebar-footer">
          <div className="erp-status-dot" />

          <div>
            <div className="erp-sidebar-footer-title">
              Live sync active
            </div>

            <div className="erp-sidebar-footer-subtitle">
              Backend connected
            </div>
          </div>
        </div>
      </aside>

      <main className="erp-main">
        <header className="erp-topbar">
          <div>
            <div className="erp-page-kicker">
              {currentPage.description}
            </div>

            <h1 className="erp-page-title">
              {currentPage.label}
            </h1>
          </div>

          <div className="erp-topbar-actions">
            <div className="erp-search-pill">
              Operations overview
            </div>

            <div className="erp-user-chip">
              Admin
            </div>
          </div>
        </header>

        <div className="erp-content">
          <Routes>
            <Route
              path="/"
              element={<Products />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {

  return (

    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>

  );

}

export default App;