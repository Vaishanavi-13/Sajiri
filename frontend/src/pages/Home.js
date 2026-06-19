import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/api/products')
      .then((r) => setProducts(r.data.data.items || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <section className="hero card" style={{ marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <h1>Sajiri — Sarees & Ethnic Wear</h1>
          <p className="muted">Curated women's sarees, men's essentials, and kids' collections in Regal Rose Gold & Ivory.</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn">Shop Sarees</button>
            <button className="btn secondary" style={{ marginLeft: 8 }}>Explore All</button>
          </div>
        </div>
        <div style={{ width: 320 }}>
          <img src="/hero-saree.jpg" alt="hero" style={{ width: '100%', borderRadius: 8 }} />
        </div>
      </section>

      <section>
        <h2>Marketplace</h2>
        <div className="product-grid">
          {products.length ? products.map((p) => <ProductCard key={p._id} p={p} />) : <div>Loading products...</div>}
        </div>
      </section>
    </div>
  );
}
