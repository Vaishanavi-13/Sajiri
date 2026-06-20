import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios';
import { setCart, removeItem, updateItem, clearCart } from '../store/cartSlice';
import { getProductImage } from '../utils/productImages';

export default function Cart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!auth.isAuthenticated) return;
    try {
      const response = await API.get('/api/cart');
      dispatch(setCart(response.data.data.items || []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, [auth.isAuthenticated]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const response = await API.put('/api/cart/update', { productId, quantity });
      dispatch(setCart(response.data.data.items || []));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setLoading(true);
    try {
      const response = await API.delete(`/api/cart/remove/${productId}`);
      dispatch(setCart(response.data.data.items || []));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to remove item');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      await API.delete('/api/cart/clear');
      dispatch(clearCart());
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to clear cart');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="page-title">Cart</h2>
          <p>Please <Link to="/login">login</Link> to view your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-summary card">
        {cart.items.length === 0 ? (
          <div className="empty-state">Your cart is empty. <Link to="/">Shop the marketplace</Link></div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.product._id || item.product} className="cart-item">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src = '/placeholder.png';
                  }}
                />
                <div className="cart-item-content">
                  <h3>{item.product.name}</h3>
                  <div className="muted">₹{item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price} each</div>
                  {item.product.discountPrice > 0 && <div className="muted">Original ₹{item.product.price}</div>}
                  <div>
                    <label htmlFor={`qty-${item.product._id || item.product}`}>Qty</label>
                    <input
                      id={`qty-${item.product._id || item.product}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product._id || item.product, Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div style={{ fontWeight: 700 }}>₹{(item.quantity * (item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price)).toFixed(0)}</div>
                  <button className="btn secondary" type="button" onClick={() => handleRemove(item.product._id || item.product)} disabled={loading}>Remove</button>
                </div>
              </div>
            ))}
            <div className="cart-summary-total">
              <div className="muted">Total Items: {cart.totalItems}</div>
              <div className="muted">Total Price: ₹{cart.totalPrice.toFixed(0)}</div>
              <div className="cart-item-actions" style={{ justifyItems: 'start' }}>
                <button className="btn secondary" type="button" onClick={handleClear} disabled={loading}>Clear Cart</button>
                <button className="btn btn-primary" type="button" onClick={() => navigate('/checkout')} disabled={loading}>Checkout</button>
              </div>
            </div>
          </>
        )}
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
}
