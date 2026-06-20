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
    <div className="container">
      <section className="hero card" style={{ marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <h1>Sajiri — Regal Indian Fashion</h1>
          <p className="muted">Discover handpicked sarees, artisan lehengas, and elegant menswear in a curated luxury collection.</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn">Shop Sarees</button>
            <button className="btn secondary">Explore All</button>
          </div>
        </div>
        <div style={{ width: 340, minWidth: 220 }}>
          <img src="/hero-saree.jpg" alt="hero" style={{ width: '100%', borderRadius: 8 }} />
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn ${category === cat ? '' : 'secondary'}`}
                type="button"
                onClick={() => setCategory(cat)}
                style={{ opacity: category === cat ? 1 : 0.75 }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="search"
              placeholder="Search designer collections"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #ccc', minWidth: 220 }}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #ccc' }}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h2>Marketplace</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="product-grid">
              {products.length ? products.map((p) => <ProductCard key={p._id} p={p} />) : <div>No products found.</div>}
            </div>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <h2>Featured Collections</h2>
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p._id} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
