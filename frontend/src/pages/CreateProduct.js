import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axios';

export default function CreateProduct() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Women',
    price: '',
    discountPrice: '',
    stock: '',
    isFeatured: false,
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => setImages(Array.from(event.target.files));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('description', form.description);
      payload.append('category', form.category);
      payload.append('price', form.price);
      payload.append('discountPrice', form.discountPrice || 0);
      payload.append('stock', form.stock || 0);
      payload.append('isFeatured', form.isFeatured);
      images.forEach((file) => payload.append('images', file));

      const token = auth.accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await API.post('/api/products/create', payload, config);
      setSuccess('Product submitted for approval.');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated || (auth.user?.role !== 'owner' && auth.user?.role !== 'admin')) {
      navigate('/login');
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="container card" style={{ maxWidth: 720, margin: '24px auto' }}>
      <h2>Add Product</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

        <label>Category</label>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Kids">Kids</option>
        </select>

        <label>Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />

        <label>Price</label>
        <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />

        <label>Discount Price</label>
        <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />

        <label>Stock</label>
        <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />

        <label>
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          Featured
        </label>

        <label>Images</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Product'}</button>
      </form>
    </div>
  );
}
