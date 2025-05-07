import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type DonationFormProps = {
  causeId?: string;
  causeTitle?: string;
};

const DonationForm = ({ causeId, causeTitle }: DonationFormProps) => {
  const [donationAmount, setDonationAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const predefinedAmounts = [25, 50, 100, 250];

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmount(false);
  };

  const handleCustomAmountClick = () => {
    setDonationAmount("");
    setCustomAmount(true);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setDonationAmount(value === "" ? "" : parseInt(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!donationAmount) {
      toast.error("Please enter a donation amount");
      return;
    }

    if (!name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Submit logic would go here
    console.log({
      causeId,
      causeTitle,
      donationAmount,
      name: anonymous ? "Anonymous" : name,
      email,
      anonymous,
    });

    toast.success("Thank you for your donation!", {
      description: "This is a demo application. No actual donation was made.",
    });

    // Reset form
    setDonationAmount("");
    setCustomAmount(false);
    setName("");
    setEmail("");
    setAnonymous(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="font-heading font-semibold text-xl mb-4">
        {causeTitle ? `Donate to ${causeTitle}` : "Make a Donation"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Amount selection */}
        <div className="mb-6">
          <Label className="mb-2 block">Select Donation Amount</Label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={
                  donationAmount === amount && !customAmount
                    ? "default"
                    : "outline"
                }
                className={
                  donationAmount === amount && !customAmount
                    ? "bg-teal-500 text-white"
                    : ""
                }
                onClick={() => handleAmountSelect(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>

          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className={`w-full justify-start ${
                customAmount ? "border-teal-500 text-teal-500" : ""
              }`}
              onClick={handleCustomAmountClick}
            >
              Custom Amount
            </Button>

            {customAmount && (
              <div className="mt-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    $
                  </span>
                  <Input
                    type="text"
                    value={donationAmount}
                    onChange={handleCustomAmountChange}
                    className="pl-8"
                    placeholder="Enter amount"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personal info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={anonymous}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm cursor-pointer">
              Make my donation anonymous
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 bg-coral-400 hover:bg-coral-500 text-white"
        >
          Complete Donation
        </Button>

        <div className="mt-4 text-center text-xs text-gray-500">
          This is a demo application. No actual donation will be made.
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
