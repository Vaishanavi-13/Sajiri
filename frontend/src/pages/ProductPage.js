import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios';
import { setCart } from '../store/cartSlice';
import { getProductImage } from '../utils/productImages';

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
      const response = await API.post(`/api/products/${id}/like`);
      setLikesCount(response.data.data.likes);
      setLiked(response.data.data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div className="container">Loading...</div>;

  const imageSrc = getProductImage(product);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="container">
      <div className="card product-details">
        <div>
          <img
            src={imageSrc}
            alt={product.name}
            onError={(event) => {
              event.target.onerror = null;
              event.target.src = '/placeholder.png';
            }}
          />
        </div>

        <div className="product-meta">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="price-group">
            <h2>₹{displayPrice}</h2>
            {product.discountPrice > 0 && <span className="price-text">₹{product.price}</span>}
          </div>
          <div className="muted">{likesCount} likes</div>
          <p className="hero-text">{product.description}</p>

          <div className="product-actions">
            <button type="button" className="btn secondary" onClick={toggleLike}>
              {liked ? '♥ Liked' : '♡ Like'}
            </button>
            <div className="field-group">
              <label htmlFor="quantity">Quantity</label>
              <input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={loading}>
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
            {error && <div className="form-error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
