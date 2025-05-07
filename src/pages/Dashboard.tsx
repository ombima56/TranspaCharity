import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

// Mock user data
const userData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  donationTotal: 750,
  donations: [
    {
      id: 'd1',
      cause: 'Clean Water for Rural Villages',
      amount: 100,
      date: new Date('2023-02-15'),
      status: 'completed'
    },
    {
      id: 'd2',
      cause: 'Wildlife Conservation Project',
      amount: 250,
      date: new Date('2023-04-22'),
      status: 'completed'
    },
    {
      id: 'd3',
      cause: 'Education for Underprivileged Children',
      amount: 150,
      date: new Date('2023-06-10'),
      status: 'completed'
    },
    {
      id: 'd4',
      cause: 'Emergency Relief for Flood Victims',
      amount: 250,
      date: new Date('2023-08-05'),
      status: 'completed'
    }
  ],
  impact: {
    livesImpacted: 120,
    causesSupported: 4,
    volunteeredHours: 8
  }
};

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl">Your Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userData.name}</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-1">Total Donated</div>
              <div className="font-heading font-bold text-3xl text-teal-600">${userData.donationTotal}</div>
              <div className="text-sm text-gray-500 mt-2">{userData.donations.length} donations</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-1">Lives Impacted</div>
              <div className="font-heading font-bold text-3xl text-coral-500">{userData.impact.livesImpacted}</div>
              <div className="text-sm text-gray-500 mt-2">{userData.impact.causesSupported} causes supported</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-1">Volunteer Hours</div>
              <div className="font-heading font-bold text-3xl text-blue-500">{userData.impact.volunteeredHours}</div>
              <div className="text-sm text-gray-500 mt-2">Thank you for your time</div>
            </div>
          </div>
          
          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6 border-b">
              <h2 className="font-heading font-semibold text-xl">Your Donation History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Cause</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {userData.donations.map(donation => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">{donation.cause}</td>
                      <td className="py-4 px-6 font-medium">${donation.amount}</td>
                      <td className="py-4 px-6 text-gray-500">
                        {donation.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {donation.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button variant="outline" size="sm">View Receipt</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Impact Section */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6 border-b">
              <h2 className="font-heading font-semibold text-xl">Your Impact</h2>
            </div>
            
            <div className="p-6">
              <div className="text-gray-600 mb-6">
                Here's how your contributions have made a difference:
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Provided clean water to 50+ people</div>
                    <div className="text-sm text-gray-500">Through the Clean Water for Rural Villages project</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-green-100 text-green-600 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Helped protect 2 endangered species</div>
                    <div className="text-sm text-gray-500">Through the Wildlife Conservation Project</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-purple-100 text-purple-600 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Provided education for 5 children</div>
                    <div className="text-sm text-gray-500">Through the Education for Underprivileged Children project</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-amber-100 text-amber-600 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Supported 10 families affected by floods</div>
                    <div className="text-sm text-gray-500">Through the Emergency Relief for Flood Victims project</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-sm p-8 text-center">
            <h3 className="font-heading font-bold text-2xl text-white mb-4">Ready to Make More Impact?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Your continued support helps us reach more people and create lasting change in communities around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                  Donate Again
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
