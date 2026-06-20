import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios';
import { logout } from '../store/authSlice';

export default function Header() {
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout error', err);
    }
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="brand">
          <span className="brand-icon">S</span>
          <span className="brand-copy">
            <span className="brand-name">Sajiri</span>
            <span className="brand-tag">Regal Couture</span>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Home</NavLink>
          <NavLink to="/cart" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Cart{cart.totalItems ? ` (${cart.totalItems})` : ''}</NavLink>
          {auth.isAuthenticated && <NavLink to="/orders" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>My Orders</NavLink>}
          {auth.isAuthenticated && auth.user?.role === 'owner' && (
            <NavLink to="/owner" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Owner Dashboard</NavLink>
          )}
          {auth.isAuthenticated && auth.user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Admin Dashboard</NavLink>
          )}
          {!auth.isAuthenticated && <NavLink to="/login" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Login</NavLink>}
          {!auth.isAuthenticated && <NavLink to="/signup" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>Signup</NavLink>}
          {auth.isAuthenticated && <span className="nav-user">Hi, {auth.user?.firstName}</span>}
          {auth.isAuthenticated && <button type="button" className="nav-button" onClick={handleLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  );
}
