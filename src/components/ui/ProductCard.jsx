import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <div className="card-modern">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden" style={{height: '240px'}}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x240'}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{transition: 'transform 0.4s ease'}}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded text-sm font-medium">
              Low Stock
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              Sold Out
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <Link to={`/products/${product._id}`}>
          <h3 className="h4 mb-2 text-primary" style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-secondary mb-3">{product.category?.name}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-primary">${product.price}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-secondary">4.8</span>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full btn ${product.stock === 0 ? 'btn-secondary' : 'btn-primary'}`}
          style={{
            opacity: product.stock === 0 ? 0.5 : 1,
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;