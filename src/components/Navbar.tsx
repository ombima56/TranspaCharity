import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, BarChart3, User, Settings, Menu, X } from "lucide-react";
import { WalletConnectButton } from "./Web3Provider";
import { auth } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const isAuthenticated = auth.isAuthenticated();
  const currentUser = auth.getUser();
  const isAdmin = currentUser?.role === 'admin';
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b bg-teal-300 backdrop-blur-md sticky top-0 z-10">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-coral-400" />
          <span className="font-heading font-bold text-xl text-gradient">
            TranspaCharity
          </span>
        </Link>

        {/* Desktop Navigation */}
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
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <WalletConnectButton />
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    My Donations
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button
                  variant="outline"
                  className="border-teal-500 text-teal-500 hover:bg-teal-50"
                >
                  <User size={16} className="mr-1" />
                  {isAdmin ? "Admin Profile" : "Profile"}
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    className="border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    <Settings size={16} className="mr-1" />
                    Dashboard
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                className="border-teal-500 text-teal-500 hover:bg-teal-50"
              >
                Login
              </Button>
            </Link>
          )}
          {!isAdmin && (
            <Link to="/donate">
              <Button className="bg-coral-400 hover:bg-coral-500 text-white">
                Donate Now
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-600 hover:text-teal-100 hover:bg-teal-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-teal-300 overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-screen py-4" : "max-h-0"
        )}
      >
        <div className="container flex flex-col space-y-4">
          <Link
            to="/"
            className="text-gray-600 hover:text-teal-100 transition-colors py-2 border-b border-teal-400"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/causes"
            className="text-gray-600 hover:text-teal-100 transition-colors py-2 border-b border-teal-400"
            onClick={() => setIsMenuOpen(false)}
          >
            Causes
          </Link>
          <Link
            to="/transactions"
            className="text-gray-600 hover:text-teal-100 transition-colors py-2 border-b border-teal-400 flex items-center gap-1"
            onClick={() => setIsMenuOpen(false)}
          >
            <BarChart3 size={16} />
            <span>Transactions</span>
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-teal-100 transition-colors py-2 border-b border-teal-400"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          <div className="pt-2 flex flex-col space-y-3">
            <WalletConnectButton />
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-teal-500 text-teal-500 hover:bg-teal-50"
                    >
                      My Donations
                    </Button>
                  </Link>
                )}
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    <User size={16} className="mr-1" />
                    {isAdmin ? "Admin Profile" : "Profile"}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-teal-500 text-teal-500 hover:bg-teal-50"
                    >
                      <Settings size={16} className="mr-1" />
                      Dashboard
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-teal-500 text-teal-500 hover:bg-teal-50"
                >
                  Login
                </Button>
              </Link>
            )}
            {!isAdmin && (
              <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-coral-400 hover:bg-coral-500 text-white">
                  Donate Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
