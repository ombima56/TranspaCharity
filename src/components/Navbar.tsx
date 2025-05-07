import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-coral-400" />
          <span className="font-heading font-bold text-xl text-gradient">KindDeeds</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-teal-500 transition-colors">Home</Link>
          <Link to="/causes" className="text-gray-600 hover:text-teal-500 transition-colors">Causes</Link>
          <Link to="/about" className="text-gray-600 hover:text-teal-500 transition-colors">About</Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">My Donations</Button>
          </Link>
          <Link to="/donate">
            <Button className="bg-coral-400 hover:bg-coral-500 text-white">Donate Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
