import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios';
import { setCart, removeItem, updateItem, clearCart } from '../store/cartSlice';

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
      <div className="container card">
        <h2>Cart</h2>
        <p>Please <Link to="/login">login</Link> to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Cart</h2>
      <div className="card">
        {cart.items.length === 0 ? (
          <div>Your cart is empty. <Link to="/">Shop the marketplace</Link></div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.product._id || item.product} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                <img src={item.product.image || (item.product.images && item.product.images[0]?.url) || '/placeholder.png'} alt={item.product.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <h3>{item.product.name}</h3>
                  <div className="muted">₹{item.product.price} each</div>
                  <div style={{ marginTop: 8 }}>
                    <label>
                      Qty
                      <input type="number" min="1" value={item.quantity} onChange={(e) => handleQuantityChange(item.product._id || item.product, Number(e.target.value))} style={{ width: 72, marginLeft: 8 }} />
                    </label>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>₹{(item.quantity * item.product.price).toFixed(0)}</div>
                  <button className="btn secondary" type="button" onClick={() => handleRemove(item.product._id || item.product)} disabled={loading}>Remove</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <div>
                <p className="muted">Total Items: {cart.totalItems}</p>
                <p className="muted">Total Price: ₹{cart.totalPrice.toFixed(0)}</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn secondary" type="button" onClick={handleClear} disabled={loading}>Clear Cart</button>
                <button className="btn" type="button" onClick={() => navigate('/checkout')} disabled={loading}>Checkout</button>
              </div>
            </div>
          </>
        )}
        {error && <div className="form-error" style={{ marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}
