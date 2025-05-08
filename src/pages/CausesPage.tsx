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
// Remove import for hardcoded causes
// import { causes } from '@/data/causes';

const CausesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");

  // Fetch causes from API
  const { data: causesData, isLoading: isLoadingCauses } = useQuery({
    queryKey: ["causes"],
    queryFn: async () => {
      const response = await causesApi.getAll();
      return response.data;
    },
  });

  // Fetch categories from API
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      return response.data;
    },
  });

  const categories = categoriesData
    ? [...new Set(categoriesData.map((cat: any) => cat.name))]
    : [];

  const filteredCauses = causesData
    ? causesData
        .filter((cause: CauseProps) => {
          const matchesSearch =
            cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cause.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            cause.organization.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesCategory =
            category === "all" || cause.category === category;

          return matchesSearch && matchesCategory;
        })
        .sort((a: CauseProps, b: CauseProps) => {
          if (sortBy === "raised-desc")
            return b.raised_amount - a.raised_amount;
          if (sortBy === "raised-asc") return a.raised_amount - b.raised_amount;
          if (sortBy === "goal-desc") return b.goal_amount - a.goal_amount;
          if (sortBy === "goal-asc") return a.goal_amount - b.goal_amount;
          // Default: most raised first
          return b.raised_amount - a.raised_amount;
        })
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-teal-500/10 to-coral-500/10 py-12 md:py-16">
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
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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
                <SelectTrigger>
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
                {filteredCauses.map((cause) => (
                  <CauseCard key={cause.id} cause={cause} />
                ))}
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
