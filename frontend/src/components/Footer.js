import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-grid">
        <div>
          <h3>Sajiri</h3>
          <p>Regal rose gold & ivory sarees, ethnic wear, and festive essentials for every celebration.</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/cart">Cart</Link>
          </nav>
        </div>
      </div>
      <div className="footer-note">© {new Date().getFullYear()} Sajiri. Crafted with elegance.</div>
    </footer>
  );
}
