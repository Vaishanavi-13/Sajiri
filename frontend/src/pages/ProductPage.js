import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios';
import { setCart } from '../store/cartSlice';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/api/products/${id}`)
      .then((r) => setProduct(r.data.data))
      .catch(() => setProduct(null));
  }, [id]);

  const handleAddToCart = async () => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/api/cart/add', { productId: id, quantity });
      dispatch(setCart(response.data.data.items || []));
      navigate('/cart');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add to cart');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="container">Loading...</div>;

  const imageSrc = product.image || (product.images?.[0]?.url) || '/placeholder.png';

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <img src={imageSrc} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
        </div>
        <div style={{ width: 360, minWidth: 320 }}>
          <h1 style={{ fontFamily: 'Playfair Display' }}>{product.name}</h1>
          <div className="muted">{product.category}</div>
          <h2>₹{product.price}</h2>
          <p className="muted">{product.description}</p>
          <div style={{ marginTop: 16 }}>
            <label>
              Quantity
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
            </label>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={handleAddToCart} disabled={loading}>{loading ? 'Adding...' : 'Add to Cart'}</button>
          </div>
          {error && <div className="form-error" style={{ marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
