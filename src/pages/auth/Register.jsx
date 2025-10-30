import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
// import Button from '../../components/ui/Button';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });

  const [formErrors, setFormErrors] = useState({});

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
    // Clear field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...submitData } = formData;
      dispatch(register(submitData));
    }
  };

  return (
    <div className="bg-secondary section" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="card" style={{maxWidth: '450px', width: '100%'}}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="h2 mb-4 text-primary">
              Create your account
            </h2>
            <p className="text-secondary">
              Or{' '}
              <Link to="/login" className="text-accent hover:text-accent-light font-medium">
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded mb-6" style={{border: '1px solid #fecaca'}}>
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg text-primary"
                style={{
                  borderColor: formErrors.name ? '#fca5a5' : 'var(--border)',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
                placeholder="Enter your full name"
              />
              {formErrors.name && (
                <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
            
            <div className="mb-4">
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
                  borderColor: formErrors.email ? '#fca5a5' : 'var(--border)',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            
            <div className="mb-4">
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
                  borderColor: formErrors.password ? '#fca5a5' : 'var(--border)',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg text-primary"
                style={{
                  borderColor: formErrors.confirmPassword ? '#fca5a5' : 'var(--border)',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="role" className="block text-sm font-medium text-primary mb-2">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg text-primary bg-white"
                style={{
                  borderColor: 'var(--border)',
                  outline: 'none'
                }}
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;