
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-coral-400" />
              <span className="font-heading font-bold text-xl text-gradient">KindDeeds</span>
            </div>
            <p className="text-gray-600 text-sm">
              Empowering change through generosity. Your donations make a real difference in the lives of those in need.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-teal-500 text-sm">Home</Link></li>
              <li><Link to="/causes" className="text-gray-600 hover:text-teal-500 text-sm">Explore Causes</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-teal-500 text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-teal-500 text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-gray-600 hover:text-teal-500 text-sm">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-teal-500 text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-teal-500 text-sm">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Connect With Us</h3>
            <p className="text-gray-600 text-sm mb-4">Join our newsletter to stay updated on new causes and impact stories.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm w-full"
              />
              <button className="bg-teal-500 text-white px-4 py-2 rounded-r-lg hover:bg-teal-600 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} KindDeeds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
