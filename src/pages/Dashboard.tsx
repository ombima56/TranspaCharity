
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { donationsApi, auth, causesApi } from '@/lib/api';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Heart, Calendar, Gift, User, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Donation, Cause } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your dashboard");
      navigate("/login");
      return;
    }
    
    // Redirect admins to admin dashboard
    if (auth.isAdmin()) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch user donations
  const { data: userDonations = [], isLoading: isLoadingDonations } = useQuery<Donation[]>({
    queryKey: ["userDonations"],
    queryFn: async () => {
      try {
        const response = await donationsApi.getMyDonations();
        return response.data || [];
      } catch (error) {
        console.error("Error fetching user donations:", error);
        return [];
      }
    },
    enabled: isAuthenticated
  });
  
  // Fetch recommended causes
  const { data: recommendedCauses = [], isLoading: isLoadingCauses } = useQuery<Cause[]>({
    queryKey: ["recommendedCauses"],
    queryFn: async () => {
      try {
        const response = await causesApi.getFeatured();
        return response.data || [];
      } catch (error) {
        console.error("Error fetching recommended causes:", error);
        return [];
      }
    },
    enabled: isAuthenticated
  });
  
  const totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const causesSupported = new Set(userDonations.map(d => d.cause_id)).size;
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b py-8">
          <div className="container">
            <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">
              My Donation Dashboard
            </h1>
            <p className="text-gray-600">
              Track your giving and see the impact you've made.
            </p>
          </div>
        </section>
        
        {/* Dashboard Content */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-coral-50 text-coral-500 p-3 rounded-full mb-3">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div className="font-heading font-bold text-2xl">${totalDonated}</div>
                        <div className="text-gray-500 text-sm mt-1">Total Donated</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-teal-50 text-teal-500 p-3 rounded-full mb-3">
                          <Gift className="h-5 w-5" />
                        </div>
                        <div className="font-heading font-bold text-2xl">{userDonations.length}</div>
                        <div className="text-gray-500 text-sm mt-1">Donations Made</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-50 text-blue-500 p-3 rounded-full mb-3">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="font-heading font-bold text-2xl">{causesSupported}</div>
                        <div className="text-gray-500 text-sm mt-1">Causes Supported</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Tabs */}
                <Tabs defaultValue="donations" className="mb-8">
                  <TabsList className="mb-6">
                    <TabsTrigger value="donations">My Donations</TabsTrigger>
                    <TabsTrigger value="impact">My Impact</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="donations">
                    <Card>
                      <CardHeader>
                        <CardTitle>Donation History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y">
                          {userDonations.length > 0 ? (
                            userDonations.map((donation, index) => (
                              <div key={index} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="font-medium">{donation.cause}</div>
                                  <div className="text-sm text-gray-500 mt-1">{donation.date}</div>
                                </div>
                                <div className="mt-2 sm:mt-0 flex items-center gap-4">
                                  <span className="font-medium text-teal-600">${donation.amount}</span>
                                  <span className="inline-block text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full capitalize">
                                    {donation.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-8 text-center">
                              <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
                              <Link to="/causes">
                                <Button className="bg-teal-500 hover:bg-teal-600">Find Causes to Support</Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="impact">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Impact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-center">
                            <p className="text-gray-700 mb-2">
                              Thanks to your support, you've helped:
                            </p>
                            <ul className="text-left max-w-md mx-auto space-y-2 text-teal-700">
                              <li className="flex items-center">
                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Provide clean water to 20+ families
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Fund educational supplies for 5 students
                              </li>
                              <li className="flex items-center">
                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Support disaster relief efforts
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="font-heading font-medium text-lg mb-3">Impact Certificates</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {userDonations.map((donation, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-white">
                                  <div className="font-medium mb-1">{donation.cause}</div>
                                  <div className="text-sm text-gray-500 mb-3">Donated on {donation.date}</div>
                                  <Button variant="outline" size="sm" className="w-full">
                                    View Certificate
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-heading font-medium text-lg mb-3">Profile Information</h3>
                            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                              <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
                                <User className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="font-medium">{auth.getUser()?.name || "User"}</div>
                                <div className="text-sm text-gray-500">{auth.getUser()?.email || "user@example.com"}</div>
                              </div>
                              <Link to="/profile">
                                <Button variant="outline" size="sm" className="ml-auto">
                                  Edit Profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-heading font-medium text-lg mb-3">Notification Preferences</h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="font-medium">Email Notifications</div>
                                  <div className="text-sm text-gray-500">Receive updates about your donations</div>
                                </div>
                                <div>
                                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="font-medium">Newsletter</div>
                                  <div className="text-sm text-gray-500">Monthly updates and stories</div>
                                </div>
                                <div>
                                  <input type="checkbox" className="toggle toggle-primary" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button className="bg-teal-500 hover:bg-teal-600">
                              <Settings className="mr-2 h-4 w-4" /> Save Settings
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Sidebar */}
              <div>
                {/* Recommended Causes */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Recommended For You</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendedCauses.slice(0, 3).map(cause => (
                        <Link to={`/cause/${cause.id}`} key={cause.id} className="block group">
                          <div className="flex gap-3">
                            <img 
                              src={cause.image_url} 
                              alt={cause.title}
                              className="w-20 h-16 object-cover rounded"
                            />
                            <div>
                              <h4 className="font-medium text-sm group-hover:text-teal-600 transition-colors line-clamp-1">{cause.title}</h4>
                              <p className="text-gray-500 text-xs mt-1">by {cause.organization}</p>
                              <div className="flex items-center mt-1">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-teal-500" 
                                    style={{ width: `${(cause.current_amount / cause.goal_amount) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 ml-2">
                                  {Math.round((cause.current_amount / cause.goal_amount) * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Link to="/causes">
                        <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50">
                          View All Causes
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tax Info */}
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <h4 className="font-heading font-medium mb-2">Tax Deduction Info</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Download your donation receipts for tax purposes.
                      </p>
                      <Button variant="outline" className="w-full text-sm">
                        Download Tax Summary
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

export default Dashboard;
