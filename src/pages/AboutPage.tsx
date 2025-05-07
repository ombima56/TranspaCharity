import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ImpactMetric from '@/components/ImpactMetric';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Heart, Users, Droplets, School, Home } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-teal-500/10 to-coral-500/10 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
                About <span className="text-gradient">KindDeeds</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                We connect compassionate donors with impactful causes to create meaningful change in the world.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading font-bold text-3xl mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    KindDeeds was founded in 2020 with a simple mission: to make giving more transparent, efficient, and impactful. We saw a world where people wanted to help but weren't always sure how or where their contributions would make the biggest difference.
                  </p>
                  <p>
                    Starting with just three team members and a handful of partner organizations, we've grown into a platform that has facilitated millions in donations across dozens of carefully vetted causes.
                  </p>
                  <p>
                    Our commitment to transparency means that donors always know exactly where their money goes and what impact it creates. We thoroughly vet every organization we partner with to ensure they meet our rigorous standards for effectiveness and accountability.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497" 
                  alt="Team meeting" 
                  className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="text-teal-600 font-heading font-bold text-xl">5+ Years</div>
                  <div className="text-gray-600 text-sm">of making an impact</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission & Values */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading font-bold text-3xl mb-4">Our Mission & Values</h2>
              <p className="text-gray-600">
                We're guided by core principles that shape everything we do.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-teal-50 p-3 inline-flex rounded-full mb-4">
                  <svg className="h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">Transparency</h3>
                <p className="text-gray-600">
                  We believe in complete openness about how donations are used and what impact they create. We provide detailed reporting and updates on all projects.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-teal-50 p-3 inline-flex rounded-full mb-4">
                  <svg className="h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We hold ourselves and our partners to the highest ethical standards. We carefully vet all causes to ensure donations are used effectively and responsibly.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-teal-50 p-3 inline-flex rounded-full mb-4">
                  <svg className="h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">Impact</h3>
                <p className="text-gray-600">
                  We focus on maximizing the real-world impact of every dollar donated. We prioritize evidence-based approaches and measurable outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Impact */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading font-bold text-3xl mb-4">Our Impact</h2>
              <p className="text-gray-600">
                Through the generosity of our donors, we've been able to create meaningful change in communities around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
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
                icon={<Home className="h-6 w-6" />}
                value="500+"
                label="Shelters Provided"
              />
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 max-w-3xl mx-auto">
              <h3 className="font-heading font-semibold text-xl mb-4 text-center">Success Story</h3>
              <blockquote className="text-gray-600 italic mb-6">
                "The clean water project funded through KindDeeds has transformed our village. Children who once spent hours collecting water from distant, contaminated sources now attend school regularly. Waterborne illnesses have decreased dramatically, and our community is healthier and more prosperous than ever before."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="bg-gray-200 rounded-full w-12 h-12 mr-4"></div>
                <div>
                  <div className="font-medium">Maria Nguyen</div>
                  <div className="text-gray-500 text-sm">Community Leader, Mekong Delta</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading font-bold text-3xl mb-4">Meet Our Team</h2>
              <p className="text-gray-600">
                The passionate individuals behind our mission.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Founder & CEO', bio: 'Former nonprofit executive with 15 years of experience in humanitarian work.' },
                { name: 'Michael Chen', role: 'Chief Operations Officer', bio: 'Brings expertise in scaling social enterprises and maximizing operational efficiency.' },
                { name: 'Aisha Patel', role: 'Partnerships Director', bio: 'Connects with organizations worldwide to identify high-impact giving opportunities.' },
                { name: 'David Kim', role: 'Technology Lead', bio: 'Creates the digital tools that connect donors with causes effectively.' },
                { name: 'Elena Rodriguez', role: 'Impact Analyst', bio: 'Measures and reports on the effectiveness of funded projects.' },
                { name: 'James Wilson', role: 'Community Manager', bio: 'Builds and nurtures our community of donors and supporters.' }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-200 h-48"></div>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg mb-1">{member.name}</h3>
                    <div className="text-coral-500 text-sm mb-3">{member.role}</div>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading font-bold text-3xl mb-6">Join Us in Making a Difference</h2>
              <p className="text-white/90 text-lg mb-8">
                Whether through donations, volunteering, or spreading the word, there are many ways to be part of our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate">
                  <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                    <Heart className="mr-2 h-5 w-5" /> Donate Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-teal-700">
                    Get Involved
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

export default AboutPage;
