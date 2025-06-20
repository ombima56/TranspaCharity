import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CauseCard from "@/components/CauseCard";
import ImpactMetric from "@/components/ImpactMetric";
import { Heart, Users, Droplets, School } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { causesApi, donationsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const dummyCauses = [
  {
    id: 1,
    title: "Help Build a School",
    organization: "Educate Africa",
    description: "Support the construction of a new school in rural Kenya.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDh5bs9J5oaRowSg6SSMPz0N8yykwHqSdSqg&s",
    raised_amount: 5000,
    goal_amount: 10000,
    category: "Education",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Clean Water for All",
    organization: "AquaLife",
    description: "Providing access to clean drinking water.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFzqAZFGsA0J1GDdP2Ah-dgBz6unp4O9Dd1g&s",
    raised_amount: 2000,
    goal_amount: 8000,
    category: "Health",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Feed the Hungry",
    organization: "FoodShare",
    description: "Donate to fight hunger and provide meals.",
    image_url: "https://wehco.media.clients.ellingtoncms.com/img/photos/2011/12/03/feedchildren1_t600.jpg?4326734cdb8e39baa3579048ef63ad7b451e7676",
    raised_amount: 7000,
    goal_amount: 10000,
    category: "Hunger",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];


const Index = () => {
  // Fetch featured causes from API
  const { data: featuredCausesResponse, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["featuredCauses"],
    queryFn: () => causesApi.getFeatured(),
  });

  // Fetch recent donations from API
  const { data: recentDonationsResponse, isLoading: isLoadingDonations } = useQuery({
    queryKey: ["recentDonations"],
    queryFn: () => donationsApi.getRecent(5),
  });

  const featuredCauses = featuredCausesResponse?.data || [];
  const recentDonations = recentDonationsResponse?.data || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transparency in Charitable Giving
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Support causes you care about with complete transparency on how your
            donations are used.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
              <Link to="/causes">Explore Causes</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white  bg-transparent hover:bg-white/10">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Causes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Causes</h2>
          
          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              ))}
            </div>
          ) : featuredCauses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dummyCauses.slice(0, 3).map((cause) => {
                // Ensure all required properties exist with default values if needed
                const safeProps = {
                  id: cause.id || 0,
                  title: cause.title || "Untitled Cause",
                  organization: cause.organization || "Unknown Organization",
                  description: cause.description || "No description available",
                  image_url: cause.image_url || "https://placehold.co/600x400?text=No+Image",
                  raised_amount: cause.raised_amount || 0,
                  goal_amount: cause.goal_amount || 1,
                  category: cause.category || "General",
                  featured: cause.featured || false,
                  created_at: cause.created_at || new Date().toISOString(),
                  updated_at: cause.updated_at || new Date().toISOString()
                };
                
                return <CauseCard key={safeProps.id} {...safeProps} />;
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured causes available at the moment.</p>
          )}
          
          <div className="text-center mt-10">
            <Button asChild className="bg-teal-500 hover:bg-teal-600">
              <Link to="/causes">View All Causes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Donations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Donations</h2>
          
          {isLoadingDonations ? (
            <div className="max-w-3xl mx-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="mb-4 p-4 border rounded-lg">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : Array.isArray(recentDonations) && recentDonations.length > 0 ? recentDonations.map((donation) => (
            <div key={donation.id} className="mb-4 p-4 border rounded-lg">
              <p className="font-semibold">
                {donation.anonymous ? "Anonymous" : donation.user_id ? `User #${donation.user_id}` : "Anonymous"} 
                donated ${donation.amount.toFixed(2)}
              </p>
              <p className="text-gray-600">
                to cause #{donation.cause_id}
              </p>
            </div>
          )) : (
            <p className="text-center text-gray-500">No recent donations available at the moment.</p>
          )}
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-16 bg-teal-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ImpactMetric 
              icon={<Heart className="h-10 w-10 text-red-500" />}
              value="100%"
              label="Transparency"
            />
            <ImpactMetric 
              icon={<Users className="h-10 w-10 text-blue-500" />}
              value="10,000+"
              label="People Helped"
            />
            <ImpactMetric 
              icon={<Droplets className="h-10 w-10 text-teal-500" />}
              value="50+"
              label="Clean Water Projects"
            />
            <ImpactMetric 
              icon={<School className="h-10 w-10 text-yellow-500" />}
              value="200+"
              label="Schools Built"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-teal-400 text-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Your donation, no matter how small, can create ripples of
              positive change. Join us in our mission to build a better world
              for all.
            </p>
            <Link to="/donate">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 px-8"
              >
                <Heart className="mr-2 h-5 w-5" /> Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
