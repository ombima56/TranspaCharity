import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { causes } from '@/data/causes';
import CauseCard from '@/components/CauseCard';
import ImpactMetric from '@/components/ImpactMetric';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Heart, Users, Droplets, School } from 'lucide-react';

const Index = () => {
  // Filter featured causes
  const featuredCauses = causes.filter(cause => cause.featured).slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-teal-500 to-teal-700 text-white py-24">
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute left-0 bottom-0 w-full text-white" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,101.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <svg className="absolute left-0 bottom-0 w-full text-white" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" fillOpacity="0.05" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,170.7C960,181,1056,235,1152,245.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
                Make a Difference Today
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                Join our community of compassionate donors and help create meaningful change in the world through impactful giving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate">
                  <Button size="lg" className="bg-coral-400 hover:bg-coral-500 text-white">
                    <Heart className="mr-2 h-5 w-5" /> Donate Now
                  </Button>
                </Link>
                <Link to="/causes">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-teal-700">
                    Explore Causes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Impact Numbers */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl mb-4">Our Impact</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Through the generosity of our donors, we've been able to make a significant impact on communities around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <ImpactMetric 
                icon={<Users className="h-6 w-6" />}
                value="125,000+"
                label="People Helped"
              />
              <ImpactMetric 
                icon={<Droplets className="h-6 w-6" />}
                value="250+"
                label="Clean Water Projects"
              />
              <ImpactMetric 
                icon={<School className="h-6 w-6" />}
                value="85"
                label="Schools Built"
              />
              <ImpactMetric 
                icon={<Heart className="h-6 w-6" />}
                value="$2.5M+"
                label="Donations Raised"
              />
            </div>
          </div>
        </section>
        
        {/* Featured Causes */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl mb-4">Featured Causes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Support these high-priority initiatives that need immediate attention.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCauses.map(cause => (
                <CauseCard key={cause.id} cause={cause} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/causes">
                <Button className="bg-teal-500 hover:bg-teal-600">
                  View All Causes
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Making a difference is easy. Here's how you can get started.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-teal-50 h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">Find a Cause</h3>
                <p className="text-gray-600">
                  Browse our curated list of causes that align with your values and the impact you want to create.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-teal-50 h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">Make a Donation</h3>
                <p className="text-gray-600">
                  Contribute any amount that fits your budget. Every dollar makes a difference in someone's life.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-teal-50 h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">Track Your Impact</h3>
                <p className="text-gray-600">
                  Receive updates about how your contribution is making a real difference in the world.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-6">
                <svg className="h-10 w-10 mx-auto text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983V18H0Z" />
                </svg>
              </div>
              <blockquote className="text-xl md:text-2xl font-light text-gray-600 italic mb-8">
                "KindDeeds has transformed the way I give. I can easily find causes I care about, donate securely, and see the real impact of my contributions. It's giving with transparency and purpose."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="bg-gray-200 w-12 h-12 rounded-full"></div>
                <div className="ml-4 text-left">
                  <div className="font-medium">Sarah Thompson</div>
                  <div className="text-sm text-gray-500">Monthly donor since 2021</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading font-bold text-3xl mb-6">Ready to Make a Difference?</h2>
              <p className="text-white/90 text-lg mb-8">
                Your generosity can transform lives. Join our community of donors and be part of the change you wish to see in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate">
                  <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                    <Heart className="mr-2 h-5 w-5" /> Donate Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-teal-700">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
