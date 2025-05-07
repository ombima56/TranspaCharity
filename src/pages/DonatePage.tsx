
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DonationForm from '@/components/DonationForm';
import { causes } from '@/data/causes';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Heart } from 'lucide-react';

const DonatePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-teal-500/10 to-coral-500/10 py-12 md:py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Make a <span className="text-gradient">Donation</span>
              </h1>
              <p className="text-gray-600 md:text-lg">
                Your generosity creates real change. Choose how you'd like to give and make a difference today.
              </p>
            </div>
          </div>
        </section>
        
        {/* Donation Options */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="general" className="mb-8">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="general">General Donation</TabsTrigger>
                  <TabsTrigger value="specific">Support a Specific Cause</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="font-heading font-semibold text-xl mb-4">
                        Support Our Mission
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Your general donation helps us direct funds where they're needed most. We allocate these resources to the most urgent causes and operational costs that keep our platform running.
                      </p>
                      <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-teal-700 mb-2">Your Impact</h3>
                        <ul className="text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 mr-2 text-teal-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Fund critical initiatives that might not receive targeted support
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 mr-2 text-teal-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Support our work to identify and vet high-impact charitable opportunities
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 mr-2 text-teal-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Help us maintain transparency and accountability in the charitable sector
                          </li>
                        </ul>
                      </div>
                      <Card className="border-coral-100 bg-coral-50/30">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Heart className="text-coral-500 h-5 w-5" />
                            <p className="text-sm text-gray-700">
                              100% of your donation goes directly to charitable work. Our operational costs are covered by separate funding.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <DonationForm />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="specific" className="pt-8">
                  <h2 className="font-heading font-semibold text-xl mb-6 text-center">
                    Choose a Cause to Support
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {causes.map(cause => (
                      <Link 
                        to={`/cause/${cause.id}`} 
                        key={cause.id}
                        className="border rounded-lg p-4 hover:border-teal-500 hover:shadow transition-all group"
                      >
                        <div className="aspect-video rounded-md overflow-hidden mb-3">
                          <img 
                            src={cause.image}
                            alt={cause.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-medium line-clamp-1 group-hover:text-teal-600 transition-colors">
                          {cause.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 mb-2">
                          by {cause.organization}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-500" 
                              style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {Math.round((cause.raised / cause.goal) * 100)}%
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Link to="/causes">
                      <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-50">
                        See All Causes
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Additional Info */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
                  Other Ways to Help
                </h2>
                <p className="text-gray-600">
                  Beyond donating, there are many ways you can contribute to our mission.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="bg-teal-50 p-3 inline-flex rounded-full mb-4">
                        <svg className="h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-2">Become a Volunteer</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Share your time and skills to help our causes on the ground.
                      </p>
                      <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="bg-teal-50 p-3 inline-flex rounded-full mb-4">
                        <svg className="h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-2">Share Our Mission</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Spread the word about our work through your social networks.
                      </p>
                      <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50">
                        Share Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="bg-teal-50 p-3 inline-flex rounded-full mb-4">
                        <svg className="h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-2">Monthly Giving</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Make an ongoing impact by becoming a monthly supporter.
                      </p>
                      <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50">
                        Join Program
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonatePage;
