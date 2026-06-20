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
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await API.get(`/api/products/${id}`);
        const item = response.data.data;
        setProduct(item);
        setLikesCount(item.likes?.length || 0);
        setLiked(item.likes?.some((like) => like === auth.user?.id || like?._id === auth.user?.id));
      } catch (err) {
        setProduct(null);
      }
    };
    loadProduct();
  }, [id, auth.user]);

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

  const toggleLike = async () => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await API.put(`/api/products/${id}/like`);
      setLikesCount(response.data.data.likes);
      setLiked(response.data.data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div className="container">Loading...</div>;

  const imageSrc = product.image || (product.images?.[0]?.url) || '/placeholder.png';
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <img src={imageSrc} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
        </div>
        <div style={{ width: 360, minWidth: 320 }}>
          <h1 style={{ fontFamily: 'Playfair Display' }}>{product.name}</h1>
          <div className="muted">{product.category}</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2>₹{displayPrice}</h2>
            {product.discountPrice > 0 && <span style={{ textDecoration: 'line-through', color: '#a8a8a8' }}>₹{product.price}</span>}
          </div>
          <div style={{ marginTop: 6, color: '#6b7280' }}>{likesCount} likes</div>
          <p className="muted" style={{ marginTop: 18 }}>{product.description}</p>
          <button type="button" className="btn secondary" onClick={toggleLike} style={{ marginBottom: 16 }}>
            {liked ? '♥ Liked' : '♡ Like'}
          </button>
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
