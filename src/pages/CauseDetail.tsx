import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonationForm from "@/components/DonationForm";
import BlockchainDonationForm from "@/components/BlockchainDonationForm";
import TransactionHistory from "@/components/TransactionHistory";
import ImpactMetric from "@/components/ImpactMetric";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Heart,
  Clock,
  Users,
  Droplets,
  School,
  Home,
  Wallet,
} from "lucide-react";
import { causesApi, donationsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CauseProps } from "@/components/CauseCard";
// Import mock data as fallback
import { causes as mockCauses } from "@/data/causes";

const CauseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("about");

  // Fetch cause data from API with fallback to mock data
  const { data: cause, isLoading } = useQuery({
    queryKey: ["cause", id],
    queryFn: async () => {
      try {
        const response = await causesApi.getById(id || "");
        console.log("Cause API response:", response);

        // Ensure we have valid data
        if (!response || !response.data) {
          console.warn(
            "API response or response.data is undefined/null, using mock data"
          );
          const mockCause = mockCauses.find(
            (c) => c.id === parseInt(id || "0")
          );
          return mockCause || null;
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching cause, using mock data:", error);
        const mockCause = mockCauses.find((c) => c.id === parseInt(id || "0"));
        return mockCause || null;
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading font-bold text-2xl mb-4">Loading...</h1>
            <p className="text-gray-600 mb-6">
              Please wait while we load the cause details.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading font-bold text-2xl mb-4">
              Cause not found
            </h1>
            <p className="text-gray-600 mb-6">
              The cause you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/causes">
              <Button className="bg-teal-500 hover:bg-teal-600">
                Browse Other Causes
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Safely calculate progress with fallbacks for missing data
  const raisedAmount = cause.raised_amount || 0;
  const goalAmount = cause.goal_amount || 1; // Prevent division by zero
  const progress = (raisedAmount / goalAmount) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={
              cause.image_url || "https://placehold.co/600x400?text=No+Image"
            }
            alt={cause.title || "Cause"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
            <div className="inline-block bg-coral-400 text-white text-xs px-2 py-1 rounded-full mb-3">
              {cause.category || "General"}
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-4xl mb-2">
              {cause.title || "Untitled Cause"}
            </h1>
            <p className="text-white/80 md:text-lg">
              by {cause.organization || "Unknown Organization"}
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Donation Progress */}
              <Card className="p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h2 className="font-heading font-bold text-2xl">
                      ${raisedAmount.toLocaleString()}
                    </h2>
                    <p className="text-gray-500">
                      raised of ${goalAmount.toLocaleString()} goal
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">30 days left</span>
                  </div>
                </div>

                <Progress value={progress} className="h-3 mb-4" />

                <div className="flex flex-wrap gap-4">
                  {/*
                  <Button className="flex-1 bg-coral-400 hover:bg-coral-500">
                    <Heart className="mr-2 h-5 w-5" /> Donate Now
                  </Button>
                  */}
                  <Button
                    variant="outline"
                    className="flex-1 border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    Share
                  </Button>
                </div>
              </Card>

              {/* Content Tabs */}
              <Tabs
                defaultValue="about"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-8"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <div className="prose max-w-none">
                    <h3 className="font-heading font-semibold text-xl mb-4">
                      About this cause
                    </h3>
                    <p className="mb-4">
                      {cause.description || "No description available."}
                    </p>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h4 className="font-heading font-semibold text-lg mb-3">
                      The Challenge
                    </h4>
                    <p className="mb-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                    <h4 className="font-heading font-semibold text-lg mb-3">
                      Our Solution
                    </h4>
                    <p>
                      Nam libero tempore, cum soluta nobis est eligendi optio
                      cumque nihil impedit quo minus id quod maxime placeat
                      facere possimus, omnis voluptas assumenda est, omnis dolor
                      repellendus.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="updates">
                  <div className="space-y-6">
                    <div className="border-l-4 border-teal-500 pl-4">
                      <div className="text-sm text-gray-500 mb-1">
                        May 1, 2023
                      </div>
                      <h4 className="font-heading font-semibold text-lg mb-2">
                        Project Kickoff
                      </h4>
                      <p className="text-gray-700">
                        We're excited to announce that we've officially started
                        work on this project. Thanks to the initial donations,
                        we've secured the necessary permits and assembled our
                        team.
                      </p>
                    </div>

                    <div className="border-l-4 border-teal-500 pl-4">
                      <div className="text-sm text-gray-500 mb-1">
                        April 15, 2023
                      </div>
                      <h4 className="font-heading font-semibold text-lg mb-2">
                        Planning Phase Complete
                      </h4>
                      <p className="text-gray-700">
                        We've completed the detailed planning phase for this
                        initiative. Our team has conducted thorough research and
                        developed a comprehensive strategy to maximize impact.
                      </p>
                    </div>

                    <div className="border-l-4 border-gray-300 pl-4">
                      <p className="text-gray-500 italic">
                        More updates will be posted as the project progresses.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="impact">
                  <div className="space-y-6">
                    <h3 className="font-heading font-semibold text-xl mb-4">
                      Our Impact So Far
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <ImpactMetric
                        icon={<Users className="h-5 w-5" />}
                        value="500+"
                        label="People Helped"
                      />
                      <ImpactMetric
                        icon={<Droplets className="h-5 w-5" />}
                        value="5"
                        label="Communities Served"
                      />
                      <ImpactMetric
                        icon={<School className="h-5 w-5" />}
                        value="3"
                        label="Programs Launched"
                      />
                      <ImpactMetric
                        icon={<Home className="h-5 w-5" />}
                        value="85%"
                        label="Sustainability Rate"
                      />
                    </div>

                    <p className="text-gray-700 mb-6">
                      With your continued support, we aim to double our impact
                      in the coming year. Each donation brings us one step
                      closer to our goals.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-heading font-semibold text-lg mb-3">
                        Success Story
                      </h4>
                      <p className="italic text-gray-600 mb-4">
                        "Thanks to this initiative, our community now has access
                        to clean water for the first time in decades. The impact
                        on health and quality of life has been immeasurable."
                      </p>
                      <div className="font-medium">
                        — Maria C., Community Leader
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Donation Form */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="mb-4">
                <h3 className="font-heading font-semibold text-lg mb-2">
                  Make a Donation
                </h3>
                <p className="text-gray-600 text-sm">
                  Your support makes a real difference. All donations are
                  tax-deductible.
                </p>
              </div>

              <Tabs defaultValue="traditional" className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="traditional">
                    <Heart className="mr-2 h-4 w-4" /> Traditional
                  </TabsTrigger>
                  <TabsTrigger value="blockchain">
                    <Wallet className="mr-2 h-4 w-4" /> Blockchain
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="traditional" className="mt-4">
                  <DonationForm causeId={cause.id} causeTitle={cause.title} />
                </TabsContent>
                <TabsContent value="blockchain" className="mt-4">
                  <BlockchainDonationForm
                    causeId={cause.id}
                    causeTitle={cause.title}
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <h4 className="font-heading font-semibold text-md mb-2">
                  Blockchain Transactions
                </h4>
                <TransactionHistory causeId={cause.id} limit={5} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CauseDetail;
