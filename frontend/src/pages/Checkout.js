import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios';
import { clearCart } from '../store/cartSlice';

export default function Checkout() {
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [shipping, setShipping] = useState({ address: '', city: '', zipCode: '', phoneNumber: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.items.length) {
      setError('Your cart is empty');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const orderItems = cart.items.map((item) => {
        const product = item.product || {};
        const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
        return {
          product: product._id || item.product,
          name: product.name,
          image: product.image || (product.images?.[0]?.url) || '',
          price: unitPrice,
          quantity: item.quantity,
        };
      });
      const totalPrice = cart.items.reduce((total, item) => {
        const product = item.product || {};
        const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
        return total + unitPrice * item.quantity;
      }, 0);
      const payload = { orderItems, shippingAddress: shipping, paymentMethod, totalPrice };
      await API.post('/api/orders', payload);
      dispatch(clearCart());
      setMessage('Order placed successfully. You can track it in My Orders.');
      setTimeout(() => navigate('/orders'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container card">
      <h2>Checkout</h2>
      <div style={{ display: 'grid', gap: 18 }}>
        <div>
          <h3>Delivery Information</h3>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="address">Address</label>
            <input id="address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required />
            <label htmlFor="city">City</label>
            <input id="city" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required />
            <label htmlFor="zipCode">ZIP Code</label>
            <input id="zipCode" value={shipping.zipCode} onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })} required />
            <label htmlFor="phoneNumber">Phone Number</label>
            <input id="phoneNumber" value={shipping.phoneNumber} onChange={(e) => setShipping({ ...shipping, phoneNumber: e.target.value })} required />
            <label htmlFor="paymentMethod">Payment Option</label>
            <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="COD">Cash on Delivery</option>
              <option value="RAZORPAY">Pay with Razorpay</option>
            </select>
            <div style={{ marginTop: 12 }}>
              <strong>Order Total:</strong> ₹{cart.totalPrice.toFixed(0)}
            </div>
            {error && <div className="form-error">{error}</div>}
            {message && <div className="form-success">{message}</div>}
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Placing order...' : 'Place Order'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
