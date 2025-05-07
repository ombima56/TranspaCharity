import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import DonationForm from '@/components/DonationForm';
import { causes } from '@/data/causes';

const DonatePage = () => {
  const [searchParams] = useSearchParams();
  const initialCauseId = searchParams.get('causeId') || '';
  
  const [selectedTab, setSelectedTab] = useState<'general' | 'specific'>('general');
  const [selectedCause, setSelectedCause] = useState<string>(initialCauseId);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-teal-500/10 to-coral-500/10 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
                Make a Donation
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Your generosity powers our mission. Choose where you want your donation to make an impact.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {/* Donation Type Tabs */}
              <div className="bg-white rounded-lg shadow-sm p-2 mb-8">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`py-3 px-4 rounded-md font-medium text-center transition-colors ${
                      selectedTab === 'general' 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedTab('general')}
                  >
                    General Donation
                  </button>
                  <button
                    className={`py-3 px-4 rounded-md font-medium text-center transition-colors ${
                      selectedTab === 'specific' 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedTab('specific')}
                  >
                    Specific Cause
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              {selectedTab === 'general' ? (
                <div className="mb-8 text-center">
                  <p className="text-gray-600 mb-6">
                    General donations provide us with the flexibility to direct funds where they are needed most. 
                    Your contribution will support our entire mission and all the causes we champion.
                  </p>
                  <DonationForm />
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-gray-600 mb-6 text-center">
                    Choose a specific cause to support. 100% of your donation will go directly to supporting your selected initiative.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {causes.map(cause => (
                      <div 
                        key={cause.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center ${
                          selectedCause === cause.id 
                            ? 'border-teal-500 bg-teal-50' 
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCause(cause.id)}
                      >
                        <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden mr-4">
                          <img 
                            src={cause.image} 
                            alt={cause.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{cause.title}</div>
                          <div className="text-sm text-gray-500">{cause.organization}</div>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              selectedCause === cause.id
                                ? 'border-teal-500 bg-teal-500' 
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedCause === cause.id && (
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="white" 
                                className="w-5 h-5"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedCause && (
                    <DonationForm 
                      causeId={selectedCause}
                      causeTitle={causes.find(c => c.id === selectedCause)?.title}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DonatePage;
