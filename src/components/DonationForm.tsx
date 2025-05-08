import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "./ui/use-toast";
import { Heart } from "lucide-react";
import { donationsApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface DonationFormProps {
  causeId?: number;
  causeTitle?: string;
  onSuccess?: () => void;
}

const DonationForm = ({
  causeId,
  causeTitle,
  onSuccess,
}: DonationFormProps) => {
  const [amount, setAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount("custom");
  };

  // Create a mutation for submitting donations
  const createDonation = useMutation({
    mutationFn: (data: any) => donationsApi.create(data),
    onSuccess: () => {
      toast({
        title: "Thank you for your donation!",
        description: `Your donation of $${
          amount === "custom" ? customAmount : amount
        } has been received.`,
      });

      setIsSubmitting(false);
      setAmount("");
      setCustomAmount("");
      setName("");
      setEmail("");
      setIsAnonymous(false);

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error submitting donation",
        description:
          error.message ||
          "There was an error processing your donation. Please try again.",
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const donationAmount = amount === "custom" ? customAmount : amount;

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
      });
      return;
    }

    if (!name || !email) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill out all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    // Submit donation to API
    createDonation.mutate({
      cause_id: causeId,
      amount: parseFloat(donationAmount),
      user_name: name,
      email: email,
      is_anonymous: isAnonymous,
      status: "completed", // In a real app, this would be 'pending' until payment is processed
    });
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {causeTitle && (
              <div className="pb-2 border-b">
                <h3 className="font-heading font-medium">
                  Donating to: {causeTitle}
                </h3>
              </div>
            )}

            <div>
              <Label className="text-base font-medium mb-3 block">
                Select donation amount
              </Label>
              <RadioGroup
                value={amount}
                onValueChange={handleAmountSelect}
                className="flex flex-wrap gap-3"
              >
                {["10", "25", "50", "100", "250"].map((value) => (
                  <div key={value} className="flex-1 min-w-[80px]">
                    <RadioGroupItem
                      value={value}
                      id={`amount-${value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`amount-${value}`}
                      className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50 [&:has([data-state=checked])]:border-teal-500"
                    >
                      ${value}
                    </Label>
                  </div>
                ))}
                <div className="flex-1 min-w-[80px]">
                  <RadioGroupItem
                    value="custom"
                    id="amount-custom"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="amount-custom"
                    className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-teal-500 peer-data-[state=checked]:bg-teal-50 [&:has([data-state=checked])]:border-teal-500"
                  >
                    Custom
                  </Label>
                </div>
              </RadioGroup>

              {amount === "custom" && (
                <div className="mt-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      type="number"
                      value={customAmount}
                      onChange={handleCustomAmount}
                      placeholder="Enter amount"
                      className="pl-7"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="rounded text-teal-500 focus:ring-teal-500"
                />
                <Label htmlFor="anonymous" className="text-sm text-gray-600">
                  Make my donation anonymous
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Complete Donation
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
