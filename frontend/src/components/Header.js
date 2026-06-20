import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <header className="container header">
      <Link to="/" className="brand">
        <span className="brand-mark">S</span> Sajiri
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart{cart.totalItems ? ` (${cart.totalItems})` : ''}</Link>
        {auth.isAuthenticated && <Link to="/orders">My Orders</Link>}
        {auth.isAuthenticated && (auth.user?.role === 'owner' || auth.user?.role === 'admin') && <Link to="/dashboard">Dashboard</Link>}
        {auth.isAuthenticated && auth.user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {!auth.isAuthenticated && <Link to="/login">Login</Link>}
        {!auth.isAuthenticated && <Link to="/signup">Signup</Link>}
        {auth.isAuthenticated && <span className="nav-user">Hi, {auth.user?.firstName}</span>}
        {auth.isAuthenticated && <button type="button" className="nav-logout" onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
}
