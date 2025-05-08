import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from './ui/use-toast';
import { Heart, Loader2 } from 'lucide-react';
import { useWeb3 } from './Web3Provider';
import web3Service from '@/lib/web3';

interface BlockchainDonationFormProps {
  causeId?: number;
  causeTitle?: string;
  onSuccess?: () => void;
}

const BlockchainDonationForm: React.FC<BlockchainDonationFormProps> = ({
  causeId,
  causeTitle,
  onSuccess,
}) => {
  const { web3State } = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const donationAmount = amount === 'custom' ? customAmount : amount;

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid amount',
        description: 'Please enter a valid donation amount.',
      });
      return;
    }

    if (!web3State.isConnected) {
      toast({
        variant: 'destructive',
        title: 'Wallet not connected',
        description: 'Please connect your wallet to make a donation.',
      });
      return;
    }

    if (!causeId) {
      toast({
        variant: 'destructive',
        title: 'Invalid cause',
        description: 'Please select a valid cause to donate to.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert amount to smallest unit (USDC has 6 decimals)
      const amountInSmallestUnit = Math.floor(parseFloat(donationAmount) * 1000000);
      
      // Make donation
      const txHash = await web3Service.donate(causeId, amountInSmallestUnit);
      
      toast({
        title: 'Thank you for your donation!',
        description: `Your donation of $${donationAmount} has been processed. Transaction hash: ${txHash.substring(0, 10)}...`,
      });

      setIsSubmitting(false);
      setAmount('');
      setCustomAmount('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error making donation:', error);
      
      toast({
        variant: 'destructive',
        title: 'Error processing donation',
        description: 'There was an error processing your donation. Please try again.',
      });
      
      setIsSubmitting(false);
    }
  };

  if (!web3State.isConnected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <Heart className="mx-auto mb-4 text-coral-500" size={32} />
            <h3 className="font-heading font-medium text-lg mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">
              Please connect your wallet to make a blockchain donation.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Your donation will be processed on the blockchain, ensuring complete transparency and no platform fees.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-medium text-lg mb-2">
                Donate with USDC
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your donation will be processed on the blockchain, ensuring complete transparency and no platform fees.
              </p>
              
              {causeTitle && (
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-sm">
                    Donating to: <span className="font-medium">{causeTitle}</span>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="donation-amount">Select Amount</Label>
                  <RadioGroup
                    value={amount}
                    onValueChange={setAmount}
                    className="grid grid-cols-3 gap-2 mt-2"
                  >
                    {['10', '25', '50', '100', '250', 'custom'].map((value) => (
                      <div key={value} className="flex items-center">
                        <RadioGroupItem
                          value={value}
                          id={`amount-${value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`amount-${value}`}
                          className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-transparent px-3 py-2 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer"
                        >
                          {value === 'custom' ? 'Custom' : `$${value}`}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {amount === 'custom' && (
                  <div>
                    <Label htmlFor="custom-amount">Custom Amount</Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="Enter amount"
                        className="pl-8"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-coral-500 hover:bg-coral-600"
              disabled={isSubmitting || !amount || (amount === 'custom' && !customAmount)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </>
              )}
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              <p>Connected as: {web3State.account}</p>
              <p className="mt-1">All donations are made using USDC stablecoin</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlockchainDonationForm;
