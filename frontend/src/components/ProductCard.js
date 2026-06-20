import React from 'react';
import { Link } from 'react-router-dom';
import { getProductImage } from '../utils/productImages';

export default function ProductCard({ p }) {
  const imageSrc = getProductImage(p);

  return (
    <article className="product-card card fade-up">
      <Link to={`/product/${p._id}`} className="product-card-link">
        <div className="product-image-wrap">
          <img
            src={imageSrc}
            alt={p.name}
            className="product-image"
            onError={(event) => {
              event.target.onerror = null;
              event.target.src = '/placeholder.png';
            }}
          />
          <span className="likes-pill">{p.likes?.length || 0} ♥</span>
        </div>

        <div className="product-card-body">
          <div className="product-category">{p.category}</div>
          <h3>{p.name}</h3>
          <div className="price-row">
            {p.discountPrice > 0 ? (
              <>
                <span className="price-original">₹{p.price}</span>
                <span className="price-final">₹{p.discountPrice}</span>
              </>
            ) : (
              <span className="price-final">₹{p.price}</span>
            )}
          </div>
        </div>
      </Link>
      <Link to={`/product/${p._id}`} className="btn btn-card">Add to Cart</Link>
    </article>
  );
}
