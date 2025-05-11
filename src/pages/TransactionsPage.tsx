import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransactionHistory from '@/components/TransactionHistory';
import { WalletConnectButton, NetworkStatus } from '@/components/Web3Provider';

const TransactionsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-gray-300">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Blockchain Transactions
              </h1>
              <p className="text-gray-600 md:text-lg">
                View all donations made through our blockchain-powered platform. Every transaction is transparent and verifiable.
              </p>
              
              <div className="flex justify-center mt-6">
                <WalletConnectButton />
              </div>
              
              <div className="mt-2">
                <NetworkStatus />
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <TransactionHistory limit={50} />
              
              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="font-heading font-semibold text-xl mb-4">
                  About Blockchain Donations
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our platform uses blockchain technology to ensure complete transparency in the donation process. 
                    Here's how it works:
                  </p>
                  
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>No middleman fees:</strong> 100% of your donation goes directly to the charity.
                    </li>
                    <li>
                      <strong>Transparent tracking:</strong> Every donation is recorded on the blockchain and can be verified by anyone.
                    </li>
                    <li>
                      <strong>Immutable records:</strong> Once a donation is made, the record cannot be altered or deleted.
                    </li>
                    <li>
                      <strong>Real-time updates:</strong> See donations as they happen and track how funds are used.
                    </li>
                  </ul>
                  
                  <p>
                    To make a blockchain donation, you'll need a Web3 wallet (like MetaMask) and USDC tokens. 
                    Connect your wallet using the button above to get started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TransactionsPage;
