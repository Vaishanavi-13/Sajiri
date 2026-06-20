import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import { getProductImage } from '../utils/productImages';

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
    <div className="container orders-page">
      <h1 className="page-title">My Orders</h1>
      <div className="order-card card">
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders yet. <Link to="/">Start shopping</Link>.</p>
        ) : (
          <div className="order-item-list">
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <div className="muted">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="order-item-content">
                  <div>Status: <strong>{order.status}</strong></div>
                  <div>Total: ₹{order.totalPrice?.toFixed(0)}</div>
                </div>
                <div className="order-item-actions">
                  {order.orderItems.map((item) => (
                    <div key={typeof item.product === 'object' && item.product !== null ? item.product._id || item.name : item.product || item.name}
                      className="order-item"
                    >
                      <img
                        src={getProductImage(typeof item.product === 'object' && item.product !== null ? item.product : item)}
                        alt={item.name}
                        onError={(event) => {
                          event.target.onerror = null;
                          event.target.src = '/placeholder.png';
                        }}
                      />
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
