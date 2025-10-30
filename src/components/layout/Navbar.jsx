import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" style={{backdropFilter: 'blur(10px)'}}>
      <div className="container">
        <div className="flex justify-between items-center" style={{height: '70px'}}>
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Classic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-primary hover:text-accent transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-primary hover:text-accent transition-colors font-medium">
              Products
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 text-primary hover:text-accent transition-colors">
                  <span style={{fontSize: '1.25rem'}}>🛒</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
                    <span style={{fontSize: '1.25rem'}}>👤</span>
                    <span className="font-medium">{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-primary hover:bg-secondary transition-colors">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-primary hover:bg-secondary transition-colors">
                      Orders
                    </Link>
                    {user?.role === 'vendor' && (
                      <Link to="/vendor/dashboard" className="block px-4 py-2 text-primary hover:bg-secondary transition-colors">
                        Vendor Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-primary hover:bg-secondary transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-primary hover:bg-secondary transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:text-accent transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-primary hover:text-accent transition-colors text-2xl"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container py-4 space-y-3">
            <Link 
              to="/" 
              className="block text-primary hover:text-accent transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="block text-primary hover:text-accent transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/cart" 
                  className="block text-primary hover:text-accent transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Cart ({totalItems})
                </Link>
                <Link 
                  to="/profile" 
                  className="block text-primary hover:text-accent transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/orders" 
                  className="block text-primary hover:text-accent transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                <button 
                  onClick={() => {handleLogout(); setIsOpen(false);}} 
                  className="block text-primary hover:text-accent transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block text-primary hover:text-accent transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block text-primary hover:text-accent transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;