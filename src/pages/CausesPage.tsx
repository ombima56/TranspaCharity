import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CauseCard, { CauseProps } from "@/components/CauseCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { causesApi, categoriesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const dummyCauses = [
  {
    id: 1,
    title: "Clean Water for All",
    organization: "WaterAid",
    description: "Providing access to clean water in remote villages.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFzqAZFGsA0J1GDdP2Ah-dgBz6unp4O9Dd1g&s",
    raised_amount: 2500,
    goal_amount: 5000,
    category: "Health",
    featured: true,
    created_at: "2024-05-01T10:00:00Z",
    updated_at: "2024-05-10T12:00:00Z",
  },
  {
    id: 2,
    title: "Help build a school",
    organization: "Teach the Future",
    description: "Helping children in rural areas access quality education.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDh5bs9J5oaRowSg6SSMPz0N8yykwHqSdSqg&s",
    raised_amount: 3000,
    goal_amount: 7000,
    category: "Education",
    featured: false,
    created_at: "2024-04-15T14:30:00Z",
    updated_at: "2024-05-05T09:20:00Z",
  },
  {
    id: 3,
    title: "Food Relief for the Needy",
    organization: "FeedMore",
    description: "Distributing meals to low-income communities.",
    image_url: "https://wehco.media.clients.ellingtoncms.com/img/photos/2011/12/03/feedchildren1_t600.jpg?4326734cdb8e39baa3579048ef63ad7b451e7676",
    raised_amount: 4500,
    goal_amount: 6000,
    category: "Hunger",
    featured: true,
    created_at: "2024-03-20T08:00:00Z",
    updated_at: "2024-04-01T11:00:00Z",
  },
];


const CausesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");

  // Fetch causes from API
  const { data: causesData, isLoading: isLoadingCauses } = useQuery({
    queryKey: ["causes"],
    queryFn: async () => {
      try {
        const response = await causesApi.getAll();
        console.log("Causes API response:", response);

        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
        
        console.warn("No causes found in API response, returning dummy data");
        return dummyCauses;
      } catch (error) {
        console.error("Error fetching causes:", error);
        return dummyCauses;
      }
    },
  });

  // Add this after fetching causes data
  useEffect(() => {
    if (causesData && Array.isArray(causesData)) {
      console.log("Causes data sample:", causesData.slice(0, 2));
    }
  }, [causesData]);

  // Fetch categories from API
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await categoriesApi.getAll();
        console.log("Categories API response:", response);

        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        
        console.warn("Invalid API response, returning empty array");
        return [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
  });

  const categories =
    categoriesData && Array.isArray(categoriesData)
      ? [...new Set(categoriesData.map((cat: { name: string }) => cat.name))]
      : [];

  // Add debugging for causesData
  console.log("causesData before filtering:", causesData);

  // Make sure causesData is an array before filtering
  const safeData = causesData && Array.isArray(causesData) ? causesData : [];
  console.log("safeData after check:", safeData);

  const filteredCauses = safeData
    .filter((cause: CauseProps) => {
      try {
        // Safely check if properties exist before using them
        const title = cause.title || "";
        const description = cause.description || "";
        const organization = cause.organization || "";
        const causeCategory = cause.category || "";

        const matchesSearch =
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          organization.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          category === "all" || causeCategory === category;

        return matchesSearch && matchesCategory;
      } catch (error) {
        console.error("Error filtering cause:", error, cause);
        return false;
      }
    })
    .sort((a: CauseProps, b: CauseProps) => {
      try {
        const aRaised = a.raised_amount || 0;
        const bRaised = b.raised_amount || 0;
        const aGoal = a.goal_amount || 0;
        const bGoal = b.goal_amount || 0;

        if (sortBy === "raised-desc") return bRaised - aRaised;
        if (sortBy === "raised-asc") return aRaised - bRaised;
        if (sortBy === "goal-desc") return bGoal - aGoal;
        if (sortBy === "goal-asc") return aGoal - bGoal;
        // Default: most raised first
        return bRaised - aRaised;
      } catch (error) {
        console.error("Error sorting causes:", error, a, b);
        return 0;
      }
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-teal-600/40 to-coral-500/10 py-12 md:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Explore Causes
              </h1>
              <p className="text-gray-600 md:text-lg">
                Find and support causes that align with your values and make a
                positive impact in the world.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-white border-b">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search causes..."
                  className="pl-10 border border-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border border-gray-400">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border border-gray-400">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raised-desc">Most Raised</SelectItem>
                  <SelectItem value="raised-asc">Least Raised</SelectItem>
                  <SelectItem value="goal-desc">Highest Goal</SelectItem>
                  <SelectItem value="goal-asc">Lowest Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Causes Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            {isLoadingCauses ? (
              <div className="text-center py-16">
                <h3 className="font-heading font-medium text-xl mb-2">
                  Loading causes...
                </h3>
              </div>
            ) : filteredCauses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dummyCauses.map((cause) => {
                  // Ensure all required properties exist with default values
                  const safeProps = {
                    id: cause.id || 0,
                    title: cause.title || "Untitled Cause",
                    organization: cause.organization || "Unknown Organization", // Make sure we're using the organization field
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
              <div className="text-center py-16">
                <h3 className="font-heading font-medium text-xl mb-2">
                  No causes found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setCategory("all");
                  }}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CausesPage;
