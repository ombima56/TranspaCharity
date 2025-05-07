
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-heading font-bold text-6xl text-gray-800 mb-4">
            404
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! We couldn't find the page you're looking for.
          </p>
          <p className="text-gray-500 mb-8">
            The page might have been moved, deleted, or perhaps never existed.
          </p>
          <Link to="/">
            <Button className="bg-teal-500 hover:bg-teal-600">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
