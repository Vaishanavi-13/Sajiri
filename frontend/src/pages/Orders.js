import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axios';

export default function Orders() {
  const auth = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    API.get('/api/orders/my-orders')
      .then((response) => setOrders(response.data.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load orders'))
      .finally(() => setLoading(false));
  }, [auth.isAuthenticated, navigate]);

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders yet. <Link to="/">Start shopping</Link>.</p>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <div className="muted">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>Status: <strong>{order.status}</strong></div>
                    <div>Total: ₹{order.totalPrice?.toFixed(0)}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <h4>Items</h4>
                  {order.orderItems.map((item) => (
                    <div key={item.product} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                      <img src={item.image || '/placeholder.png'} alt={item.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                      <div>
                        <div>{item.name}</div>
                        <small className="muted">Qty: {item.quantity} · ₹{item.price}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
