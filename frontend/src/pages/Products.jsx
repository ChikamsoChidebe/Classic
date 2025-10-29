import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../store/slices/productSlice';
import { getCategories } from '../store/slices/categorySlice';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt'
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) params[key] = filters[key];
    });
    dispatch(getProducts(params));
    setSearchParams(params);
  }, [dispatch, filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'createdAt'
    });
  };

  return (
    <div className="bg-secondary section">
      <div className="container">
        <div className="flex flex-col gap-8 lg-products-layout">
          {/* Filters Sidebar */}
          <div className="products-sidebar">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="h4 text-primary">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-accent hover:text-accent-light font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border rounded-lg text-primary"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-primary"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="px-4 py-2 border rounded-lg text-primary"
                    style={{
                      width: '50%',
                      borderColor: 'var(--border)',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="px-4 py-2 border rounded-lg text-primary"
                    style={{
                      width: '50%',
                      borderColor: 'var(--border)',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary mb-2">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-primary"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="createdAt">Newest</option>
                  <option value="-createdAt">Oldest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-main">
            <div className="flex justify-between items-center mb-6">
              <h1 className="h2 text-primary">Products</h1>
              <p className="text-secondary">
                {pagination?.total || 0} products found
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-1 md:grid-2 lg:grid-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination?.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleFilterChange('page', page)}
                      className={`px-4 py-2 rounded ${
                        page === pagination.page
                          ? 'btn btn-primary'
                          : 'btn btn-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;