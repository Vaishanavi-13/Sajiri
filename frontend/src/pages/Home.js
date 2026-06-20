import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const categories = ['All', 'Women', 'Men', 'Kids'];
const sortOptions = [
  { value: '', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      const response = await API.get('/api/products', { params });
      setProducts(response.data.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, search, sortBy]);

  useEffect(() => {
    API.get('/api/products/featured')
      .then((res) => setFeatured(res.data.data || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div className="home-shell">
      <section className="hero-section card fade-up">
        <div className="hero-copy">
          <span className="eyebrow">Luxury Edit</span>
          <h1>Elevate every celebration with timeless Indian fashion.</h1>
          <p className="hero-text">Discover handcrafted sarees, festive lehengas, and refined menswear designed for weddings, special occasions, and everyday glamour.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => setCategory('Women')}>Shop Sarees</button>
            <button type="button" className="btn btn-secondary" onClick={() => setCategory('All')}>Explore Collection</button>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=970&q=80"
            alt="Regal fashion banner"
          />
        </div>
      </section>

      <section className="product-explore">
        <div className="section-header">
          <div>
            <span className="eyebrow">Curated Marketplace</span>
            <h2>Shop by category</h2>
          </div>
          <div className="filters-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="search-actions">
          <input
            type="search"
            className="search-input"
            placeholder="Search designer collections"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="marketplace-block">
          <div className="section-title-row">
            <h2>Marketplace</h2>
            <p className="muted">Handpicked fashion pieces for a premium wardrobe.</p>
          </div>

          {loading ? (
            <p className="loading-text">Loading products...</p>
          ) : (
            <div className="product-grid">
              {products.length ? products.map((p) => <ProductCard key={p._id} p={p} />) : <div className="empty-state">No products found.</div>}
            </div>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-shell fade-up">
          <div className="section-title-row">
            <h2>Featured Collections</h2>
            <p className="muted">Seasonal favorites and customer-loved styles.</p>
          </div>
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p._id} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
