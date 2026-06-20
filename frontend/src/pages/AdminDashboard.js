import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axios';

export default function AdminDashboard() {
  const auth = useSelector((state) => state.auth);
  const [pending, setPending] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    Promise.all([
      API.get('/api/products/pending'),
      API.get('/api/orders'),
    ])
      .then(([productsRes, ordersRes]) => {
        setPending(productsRes.data.data || []);
        setOrders(ordersRes.data.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load admin data'))
      .finally(() => setLoading(false));
  }, [auth, navigate]);

  const updateOrder = async (orderId, action) => {
    try {
      await API.put(`/api/orders/${orderId}/${action}`);
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'delivered' } : order));
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductDecision = async (productId, status) => {
    try {
      await API.put(`/api/products/${productId}/${status === 'approved' ? 'approve' : 'reject'}`);
      setPending((prev) => prev.filter((product) => product._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!auth.isAuthenticated || auth.user?.role !== 'admin') return null;

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Dashboard</h2>
        {loading ? <p>Loading admin dashboard...</p> : error ? <p className="form-error">{error}</p> : (
          <div style={{ display: 'grid', gap: 24 }}>
            <section>
              <h3>Pending Product Approvals</h3>
              {pending.length === 0 ? <p>No pending products.</p> : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {pending.map((product) => (
                    <div key={product._id} className="card" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                        <div>
                          <h4>{product.name}</h4>
                          <div className="muted">{product.category}</div>
                          <div>Seller: {product.sellerName}</div>
                          <div>{product.description}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button className="btn" type="button" onClick={() => handleProductDecision(product._id, 'approved')}>Approve</button>
                          <button className="btn secondary" type="button" onClick={() => handleProductDecision(product._id, 'rejected')}>Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3>Orders</h3>
              {orders.length === 0 ? <p>No orders yet.</p> : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {orders.map((order) => (
                    <div key={order._id} className="card" style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <h4>Order #{order._id.slice(-6)}</h4>
                          <div>Status: <strong>{order.status}</strong></div>
                          <div>Total: ₹{order.totalPrice?.toFixed(0)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {order.status !== 'accepted' && order.status !== 'rejected' && <button className="btn" type="button" onClick={() => updateOrder(order._id, 'accept')}>Accept</button>}
                          {order.status !== 'rejected' && <button className="btn secondary" type="button" onClick={() => updateOrder(order._id, 'reject')}>Reject</button>}
                          {order.status !== 'delivered' && <button className="btn" type="button" onClick={() => updateOrder(order._id, 'deliver')}>Mark Delivered</button>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
