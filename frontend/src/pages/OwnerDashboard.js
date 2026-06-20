import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axios';

export default function OwnerDashboard() {
  const auth = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated || (auth.user?.role !== 'owner' && auth.user?.role !== 'admin')) {
      navigate('/login');
      return;
    }

    Promise.all([
      API.get('/api/products/my-products'),
      API.get('/api/orders/seller-orders'),
    ])
      .then(([productsRes, ordersRes]) => {
        setProducts(productsRes.data.data || []);
        setOrders(ordersRes.data.data || []);
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard data'))
      .finally(() => setLoading(false));
  }, [auth, navigate]);

  if (!auth.isAuthenticated) return null;

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2>Seller Dashboard</h2>
            <p className="muted">Manage your collections, view seller orders, and track product approvals.</p>
          </div>
          <Link to="/create-product" className="btn">Add New Product</Link>
        </div>
      </div>

      {loading ? (
        <p>Loading seller dashboard...</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          <section className="card">
            <h3>My Products</h3>
            {products.length === 0 ? (
              <p>No products created yet. Start by adding a new style.</p>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {products.map((product) => (
                  <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ minWidth: 240 }}>
                      <h4 style={{ margin: '0 0 6px' }}>{product.name}</h4>
                      <div className="muted">{product.category}</div>
                      <div className="muted">Status: {product.status}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Link to={`/product/${product._id}`} className="btn">View</Link>
                      <span style={{ fontWeight: 700 }}>{product.likes?.length || 0} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <h3>Orders Containing Your Products</h3>
            {orders.length === 0 ? (
              <p>No seller orders yet. Your customers will appear here once they purchase your designs.</p>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {orders.map((order) => (
                  <div key={order._id} style={{ padding: 16, borderRadius: 12, background: '#fcfaf7', border: '1px solid #f0e6d7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <div>
                        <h4 style={{ margin: 0 }}>Order #{order._id.slice(-6)}</h4>
                        <div className="muted">Status: {order.status}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>Total: ₹{order.totalPrice?.toFixed(0)}</div>
                        <div className="muted">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      {order.orderItems.map((item) => (
                        <div key={item.product} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                          <img src={item.image || '/placeholder.png'} alt={item.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10 }} />
                          <div>
                            <div>{item.name}</div>
                            <div className="muted">Qty: {item.quantity} · ₹{item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
