import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, BarChart3 } from "lucide-react";
import { WalletConnectButton } from "./Web3Provider";

const Navbar = () => {
  return (
    <nav className="border-b bg-teal-300 backdrop-blur-md sticky top-0 z-10">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-coral-400" />
          <span className="font-heading font-bold text-xl text-gradient">
            TranspaCharity
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-teal-100 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/causes"
            className="text-gray-600 hover:text-teal-100 transition-colors"
          >
            Causes
          </Link>
          <Link
            to="/transactions"
            className="text-gray-600 hover:text-teal-100 transition-colors flex items-center gap-1"
          >
            <BarChart3 size={16} />
            <span>Transactions</span>
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-teal-100 transition-colors"
          >
            About
          </Link>
          <Link
            to="/admin"
            className="text-gray-600 hover:text-teal-100 transition-colors"
          >
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <WalletConnectButton />
          <Link to="/dashboard">
            <Button
              variant="outline"
              className="border-teal-500 text-teal-500 hover:bg-teal-50"
            >
              My Donations
            </Button>
          </Link>
          <Link to="/donate">
            <Button className="bg-coral-400 hover:bg-coral-500 text-white">
              Donate Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
