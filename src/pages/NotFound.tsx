import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed or doesn't exist.
        </p>
        <Link to="/">
          <Button className="bg-teal-500 hover:bg-teal-600">Return Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
