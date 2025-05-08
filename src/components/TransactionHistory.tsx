import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { ExternalLink, Clock } from 'lucide-react';
import web3Service, { Donation } from '@/lib/web3';
import { useWeb3 } from './Web3Provider';

interface TransactionHistoryProps {
  causeId?: number;
  limit?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  causeId,
  limit = 10,
}) => {
  const { web3State } = useWeb3();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!web3State.isConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allDonations = await web3Service.getDonations();
        
        // Filter by causeId if provided
        const filteredDonations = causeId
          ? allDonations.filter((donation) => donation.charityId === causeId)
          : allDonations;
        
        // Sort by timestamp (newest first) and limit
        const sortedDonations = filteredDonations
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
        
        setDonations(sortedDonations);
        setError(null);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [web3State.isConnected, causeId, limit]);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatAmount = (amount: number) => {
    // Convert from smallest unit (USDC has 6 decimals)
    return (amount / 1000000).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const getEtherscanUrl = (address: string) => {
    // Use appropriate network based on chainId
    const baseUrl = web3State.chainId === 1
      ? 'https://etherscan.io'
      : web3State.chainId === 5
      ? 'https://goerli.etherscan.io'
      : web3State.chainId === 137
      ? 'https://polygonscan.com'
      : web3State.chainId === 80001
      ? 'https://mumbai.polygonscan.com'
      : 'https://etherscan.io';
    
    return `${baseUrl}/address/${address}`;
  };

  if (!web3State.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Blockchain Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500">
              Connect your wallet to view blockchain transactions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Blockchain Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="space-y-1">
                  <div className="flex items-center">
                    <a
                      href={getEtherscanUrl(donation.donor)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center"
                    >
                      {formatAddress(donation.donor)}
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {formatTimestamp(donation.timestamp)}
                  </div>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <div className="font-medium text-teal-600">
                    {formatAmount(donation.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
