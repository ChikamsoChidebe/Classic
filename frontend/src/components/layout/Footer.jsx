import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container section-sm">
        <div className="grid grid-1 md:grid-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="h3 mb-4">Classic Wardrobe</h3>
            <p className="text-light mb-6" style={{maxWidth: '300px'}}>
              Premium fashion marketplace connecting customers with verified vendors worldwide. 
              Quality guaranteed, style delivered.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                📷
              </a>
              <a href="#" className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                🐦
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="h4 mb-4">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/products" className="block text-light hover:text-white transition-colors">
                Products
              </Link>
              <Link to="/login" className="block text-light hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="block text-light hover:text-white transition-colors">
                Register
              </Link>
              <a href="#" className="block text-light hover:text-white transition-colors">
                About Us
              </a>
            </div>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="h4 mb-4">Support</h4>
            <div className="space-y-3">
              <a href="#" className="block text-light hover:text-white transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-light hover:text-white transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-light hover:text-white transition-colors">
                Shipping Info
              </a>
              <a href="#" className="block text-light hover:text-white transition-colors">
                Returns
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary mt-8 pt-8 text-center">
          <p className="text-light">
            © 2024 Classic Wardrobe. All rights reserved. Built with ❤️ for fashion lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;