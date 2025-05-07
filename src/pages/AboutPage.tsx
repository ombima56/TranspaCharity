import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <h1 className="text-3xl font-bold text-center my-12">
          About KindDeeds
        </h1>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
