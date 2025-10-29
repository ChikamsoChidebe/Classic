import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts({ featured: true, limit: 8 }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white section relative overflow-hidden">
        <div className="absolute inset-0 bg-dark" style={{opacity: 0.1}}></div>
        <div className="container relative">
          <div className="text-center animate-fade-in-up">
            <h1 className="h1 mb-6">Classic Wardrobe</h1>
            <p className="text-lg mb-4 text-light">Premium Fashion Marketplace</p>
            <p className="text-base mb-8" style={{opacity: 0.9}}>Discover exclusive collections from verified vendors worldwide</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/products" className="btn btn-primary">
                Explore Collection
              </Link>
              <Link to="/register" className="btn btn-ghost">
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 w-full h-20 bg-primary" style={{clipPath: 'polygon(0 100%, 100% 100%, 100% 0)'}}></div>
      </section>

      {/* Stats Section */}
      <section className="bg-dark text-white section-sm">
        <div className="container">
          <div className="grid grid-2 md:grid-4 gap-6">
            <div className="stat-card">
              <div className="stat-number">15K+</div>
              <div className="text-light">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">800+</div>
              <div className="text-light">Verified Vendors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12K+</div>
              <div className="text-light">Premium Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="text-light">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary section">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="h2 mb-4 text-primary">Shop by Category</h2>
            <p className="text-secondary">Curated collections for every style</p>
          </div>
          <div className="grid grid-1 md:grid-3 gap-8">
            <Link to="/products?category=shoes" className="category-card">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop" 
                alt="Shoes" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 category-overlay"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="h3 mb-2">Footwear</h3>
                <p className="text-sm" style={{opacity: 0.9}}>Premium shoes & sneakers</p>
              </div>
            </Link>
            <Link to="/products?category=sandals" className="category-card">
              <img 
                src="https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=400&fit=crop" 
                alt="Sandals" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 category-overlay"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="h3 mb-2">Sandals</h3>
                <p className="text-sm" style={{opacity: 0.9}}>Comfort meets elegance</p>
              </div>
            </Link>
            <Link to="/products?category=accessories" className="category-card">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop" 
                alt="Accessories" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 category-overlay"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="h3 mb-2">Accessories</h3>
                <p className="text-sm" style={{opacity: 0.9}}>Complete your look</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-primary section">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="h2 mb-4 text-primary">Featured Collection</h2>
            <p className="text-secondary">Handpicked by our style experts</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-1 md:grid-2 lg:grid-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/products" className="btn btn-primary">
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary section">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="h2 mb-4 text-primary">Why Choose Us</h2>
            <p className="text-secondary">Premium service, guaranteed satisfaction</p>
          </div>
          <div className="grid grid-1 md:grid-3 gap-8">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="h4 mb-4 text-primary">Fast Delivery</h3>
              <p className="text-secondary">Free shipping on orders over $50. Express delivery available.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="h4 mb-4 text-primary">Secure Shopping</h3>
              <p className="text-secondary">Bank-level security with encrypted payments and data protection.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3 className="h4 mb-4 text-primary">Premium Quality</h3>
              <p className="text-secondary">Curated products from verified vendors with quality guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient section-sm">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="h2 mb-4">Stay Updated</h2>
            <p className="text-lg mb-8" style={{opacity: 0.9}}>Get exclusive deals and style inspiration</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center" style={{maxWidth: '400px', margin: '0 auto'}}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="newsletter-input flex-1"
              />
              <button className="btn btn-secondary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;