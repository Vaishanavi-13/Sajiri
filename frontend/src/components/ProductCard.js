import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ p }) {
  const imageSrc = p.image || (p.images && p.images[0] && p.images[0].url) || '/placeholder.png';

  return (
    <div className="product-card card">
      <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', height: 180, background: '#f6f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imageSrc ? <img src={imageSrc} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <div style={{ color: '#bbb' }}>No Image</div>}
          <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.85)', borderRadius: 999, padding: '6px 10px', fontSize: 12, fontWeight: 700 }}>
            {p.likes?.length || 0} ❤️
          </span>
        </div>
        <div style={{ padding: 12 }}>
          <h3 style={{ margin: '0 0 8px' }}>{p.name}</h3>
          <div className="muted">{p.category}</div>
          <div style={{ marginTop: 8, fontWeight: 600 }}>
            {p.discountPrice > 0 ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#a8a8a8', marginRight: 8 }}>₹{p.price}</span>
                <span>₹{p.discountPrice}</span>
              </>
            ) : (
              <span>₹{p.price}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
