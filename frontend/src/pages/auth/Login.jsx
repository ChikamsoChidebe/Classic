import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
// import Button from '../../components/ui/Button';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="bg-secondary section" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="card" style={{maxWidth: '400px', width: '100%'}}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="h2 mb-4 text-primary">
              Sign in to your account
            </h2>
            <p className="text-secondary">
              Or{' '}
              <Link to="/register" className="text-accent hover:text-accent-light font-medium">
                create a new account
              </Link>
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded mb-6" style={{border: '1px solid #fecaca'}}>
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg text-primary"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                placeholder="Enter your email"
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg text-primary"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                placeholder="Enter your password"
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <Link to="/forgot-password" className="text-sm text-accent hover:text-accent-light font-medium">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;