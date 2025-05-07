import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { causes } from '@/data/causes';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Calendar, Users, Globe } from 'lucide-react';

const CauseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const cause = causes.find(c => c.id === id);
  
  if (!cause) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-16">
          <div className="text-center">
            <h1 className="font-heading font-bold text-3xl mb-4">Cause Not Found</h1>
            <p className="text-gray-600 mb-8">The cause you're looking for doesn't exist or has been removed.</p>
            <Link to="/causes">
              <Button>View All Causes</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate percentage raised
  const percentRaised = Math.min(Math.round((cause.raised / cause.goal) * 100), 100);
  
  // Format the deadline
  const formattedDeadline = cause.deadline ? 
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(cause.deadline) : 'Ongoing';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero */}
        <div className="relative h-[400px]">
          <div className="absolute inset-0 bg-gray-900/60 z-10"></div>
          <img 
            src={cause.image} 
            alt={cause.title} 
            className="w-full h-full object-cover"
          />
          <div className="container absolute inset-0 z-20 flex items-center">
            <div className="max-w-3xl text-white">
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
                {cause.title}
              </h1>
              <p className="text-white/80 text-lg mb-8">
                {cause.organization}
              </p>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white/90">Category: </span>
                <span className="font-medium ml-2">{cause.category}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="font-heading font-bold text-2xl mb-6">About This Cause</h2>
                <p className="text-gray-600 mb-6">
                  {cause.description}
                  
                  {/* Additional paragraphs would go here */}
                  <br /><br />
                  Climate change poses an urgent threat to our planet, affecting ecosystems, communities, and wildlife worldwide. Through this initiative, we aim to:
                  <br /><br />
                  • Plant 10,000 trees in deforested areas<br />
                  • Restore critical wildlife habitats<br />
                  • Support local communities with sustainable practices<br />
                  • Educate future generations on conservation
                  <br /><br />
                  Your support will directly fund these efforts and help us combat climate change one tree at a time. Together, we can create a greener, healthier planet for generations to come.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-3 rounded-full">
                      <Calendar className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Deadline</div>
                      <div className="font-medium">{formattedDeadline}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-3 rounded-full">
                      <Users className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Donors</div>
                      <div className="font-medium">{Math.floor(cause.raised / 100)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-3 rounded-full">
                      <Globe className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium">Global</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="font-heading font-bold text-2xl mb-6">Updates</h2>
                
                <div className="border-l-2 border-teal-500 pl-6 space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-medium">Project Launch</div>
                      <div className="text-sm text-gray-500">• 3 months ago</div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      We're excited to announce the launch of our new environmental initiative. Thanks to early donors, we've already identified key locations for our first restoration projects.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-medium">First Milestone Reached</div>
                      <div className="text-sm text-gray-500">• 1 month ago</div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      We've hit our first funding milestone! This allows us to begin work on the first phase of the project, including community outreach and initial plantings.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-medium">Progress Report</div>
                      <div className="text-sm text-gray-500">• 2 weeks ago</div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      The first 1,000 trees have been planted! Our team on the ground reports excellent growth rates, and local wildlife is already beginning to return to the area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">${cause.raised.toLocaleString()} raised</span>
                    <span className="text-gray-500">of ${cause.goal.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full">
                    <div 
                      className="h-full bg-teal-500 rounded-full" 
                      style={{ width: `${percentRaised}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-teal-500 font-medium">{percentRaised}%</span>
                    <span className="text-gray-500">{Math.floor(cause.raised / 100)} donors</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <Button className="w-full bg-coral-400 hover:bg-coral-500 text-white">Donate Now</Button>
                  <Button variant="outline" className="w-full">Share This Cause</Button>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="font-heading font-semibold text-lg mb-4">Recent Donors</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Anonymous', amount: 50, time: '2 hours ago' },
                      { name: 'James R.', amount: 100, time: '1 day ago' },
                      { name: 'Sophia T.', amount: 25, time: '3 days ago' },
                      { name: 'Anonymous', amount: 75, time: '1 week ago' },
                    ].map((donor, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{donor.name}</div>
                          <div className="text-xs text-gray-500">{donor.time}</div>
                        </div>
                        <div className="font-medium">${donor.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Causes */}
        <div className="bg-gray-50 py-12">
          <div className="container">
            <h2 className="font-heading font-bold text-2xl mb-8 text-center">Related Causes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {causes
                .filter(c => c.category === cause.category && c.id !== cause.id)
                .slice(0, 3)
                .map(relatedCause => (
                  <div key={relatedCause.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedCause.image} 
                        alt={relatedCause.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading font-semibold text-lg mb-2">{relatedCause.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedCause.description}</p>
                      <Link 
                        to={`/cause/${relatedCause.id}`}
                        className="text-teal-500 font-medium hover:text-teal-600 flex items-center"
                      >
                        Learn More
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CauseDetail;
