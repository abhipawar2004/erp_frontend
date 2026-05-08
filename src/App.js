import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Products from './pages/Products';
import Orders from './pages/Orders';

function App() {

  return (

    <BrowserRouter>

      <div className="d-flex">

        {/* Sidebar */}

        <div
          style={{
            width: '240px',
            minHeight: '100vh',
            background: '#111827',
            padding: '20px'
          }}
        >

          <h2
            className="text-white mb-5"
          >
            ERP Dashboard
          </h2>

          <div className="d-grid gap-3">

            <Link
              to="/"
              className="btn btn-light"
            >
              Products
            </Link>

            <Link
              to="/orders"
              className="btn btn-light"
            >
              Orders
            </Link>

          </div>

        </div>

        {/* Main Content */}

        <div
          className="flex-grow-1 p-4"
          style={{
            background: '#f3f4f6',
            minHeight: '100vh'
          }}
        >

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

      </div>

    </BrowserRouter>

  );

}

export default App;