import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-brand-mark">S</div>
            <div>
              <h3>Sajiri</h3>
              <p>Luxury Indian fashion for weddings, celebrations, and everyday elegance.</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <nav className="footer-nav">
              <Link to="/">Home</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>help@sajiri.com</p>
            <p>+91 98765 43210</p>
            <p>New Delhi, India</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-socials">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>Pinterest</span>
          </div>
          <div className="footer-note">© {new Date().getFullYear()} Sajiri. Crafted with elegance.</div>
        </div>
      </div>
    </footer>
  );
}
