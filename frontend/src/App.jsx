import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import AdminDashboard from './pages/AdminDashboard';

const API_URL = 'http://localhost:8787'; // Default Wrangler dev port

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Shop</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<ProductList apiUrl={API_URL} />} />
            <Route path="/admin" element={<AdminDashboard apiUrl={API_URL} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
export { API_URL };
