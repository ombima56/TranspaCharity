import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

// Define the ABI
const CharityDonationABI = [
  {
    inputs: [
      { internalType: "address", name: "_usdcToken", type: "address" },
      { internalType: "address", name: "_initialOwner", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "charityId",
        type: "uint256"
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "address",
        name: "walletAddress",
        type: "address"
      }
    ],
    name: "CharityAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "charityId",
        type: "uint256"
      }
    ],
    name: "CharityVerified",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "donationId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "donor",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "charityId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isEth",
        type: "bool"
      }
    ],
    name: "DonationMade",
    type: "event"
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "address", name: "_walletAddress", type: "address" }
    ],
    name: "addCharity",
    outputs: [{ internalType: "uint256", name: "charityId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "charityCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_charityId", type: "uint256" }],
    name: "donateEth",
    outputs: [{ internalType: "uint256", name: "donationId", type: "uint256" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_charityId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "donateUsdc",
    outputs: [{ internalType: "uint256", name: "donationId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_charityId", type: "uint256" }],
    name: "getCharity",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "address", name: "walletAddress", type: "address" },
      { internalType: "bool", name: "isVerified", type: "bool" },
      { internalType: "uint256", name: "totalUsdcDonations", type: "uint256" },
      { internalType: "uint256", name: "totalEthDonations", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_donationId", type: "uint256" }],
    name: "getDonation",
    outputs: [
      { internalType: "address", name: "donor", type: "address" },
      { internalType: "uint256", name: "charityId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bool", name: "isEth", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getDonationCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as AbiItem[];

// Types
export interface Web3State {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  error: string | null;
}

export interface Charity {
  id: number;
  name: string;
  description: string;
  walletAddress: string;
  isVerified: boolean;
  totalUsdcDonations: number;
  totalEthDonations: number;
}

export interface Donation {
  id: number;
  donor: string;
  charityId: number;
  amount: number;
  timestamp: number;
  isEth: boolean;
}

// Contract addresses
const CONTRACT_ADDRESSES = {
  development: {
    CharityDonation: "0x394e2ab891c397923c4d8c65e6cc735fdc8c457d",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Mainnet USDC address
  },
  production: {
    CharityDonation: "0x394e2ab891c397923c4d8c65e6cc735fdc8c457d",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Mainnet USDC address
  },
};

// Get contract addresses based on environment
const getContractAddresses = () => {
  return process.env.NODE_ENV === "production"
    ? CONTRACT_ADDRESSES.production
    : CONTRACT_ADDRESSES.development;
};

// Web3 service class
class Web3Service {
  private web3: Web3 | null = null;
  private charityContract: any = null;
  private state: Web3State = {
    isConnected: false,
    account: null,
    chainId: null,
    error: null,
  };
  private listeners: ((state: Web3State) => void)[] = [];

  // Initialize Web3
  async initialize(): Promise<boolean> {
    if (typeof window === "undefined" || !window.ethereum) {
      this.updateState({
        ...this.state,
        error: "MetaMask is not installed",
      });
      return false;
    }

    try {
      // Create Web3 instance
      this.web3 = new Web3(window.ethereum);

      // Get contract addresses
      const addresses = getContractAddresses();

      // Create contract instances
      this.charityContract = new this.web3.eth.Contract(
        CharityDonationABI,
        addresses.CharityDonation
      );

      // Set up event listeners
      window.ethereum.on("accountsChanged", this.handleAccountsChanged);
      window.ethereum.on("chainChanged", this.handleChainChanged);
      window.ethereum.on("disconnect", this.handleDisconnect);

      // Check if already connected
      const accounts = await this.web3.eth.getAccounts();
      if (accounts.length > 0) {
        const chainId = await this.web3.eth.getChainId();
        this.updateState({
          isConnected: true,
          account: accounts[0],
          chainId: Number(chainId),
          error: null,
        });
      }

      return true;
    } catch (error) {
      this.updateState({
        ...this.state,
        error: "Failed to initialize Web3",
      });
      console.error("Failed to initialize Web3:", error);
      return false;
    }
  }

  // Connect wallet
  async connectWallet(): Promise<boolean> {
    if (!this.web3) {
      await this.initialize();
    }

    if (!this.web3) {
      return false;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chainId = await this.web3.eth.getChainId();

      this.updateState({
        isConnected: true,
        account: accounts[0],
        chainId: Number(chainId),
        error: null,
      });

      return true;
    } catch (error) {
      this.updateState({
        ...this.state,
        error: "Failed to connect wallet",
      });
      console.error("Failed to connect wallet:", error);
      return false;
    }
  }

  // Disconnect wallet
  disconnectWallet(): void {
    this.updateState({
      isConnected: false,
      account: null,
      chainId: null,
      error: null,
    });
  }

  // Get charities
  async getCharities(): Promise<Charity[]> {
    if (!this.web3 || !this.charityContract) {
      throw new Error("Web3 not initialized");
    }

    try {
      const charityCount = await this.charityContract.methods
        .charityCount()
        .call();
      const charities: Charity[] = [];

      // Convert charityCount to a number before using it in the loop
      const count = Number(charityCount);

      for (let i = 0; i < count; i++) {
        const charity = await this.charityContract.methods.getCharity(i).call();
        charities.push({
          id: i,
          name: charity.name,
          description: charity.description,
          walletAddress: charity.walletAddress,
          isVerified: charity.isVerified,
          totalUsdcDonations: Number(charity.totalUsdcDonations),
          totalEthDonations: Number(charity.totalEthDonations),
        });
      }

      return charities;
    } catch (error) {
      console.error("Failed to get charities:", error);
      throw error;
    }
  }

  // Get donations with more robust error handling
  async getDonations(): Promise<Donation[]> {
    if (!this.web3 || !this.charityContract) {
      console.warn("Web3 not initialized, returning empty array");
      return [];
    }

    try {
      // Check if we can connect to the contract at all
      try {
        // Try a simple call first to verify contract connectivity
        await this.charityContract.methods.charityCount().call();
      } catch (error) {
        console.warn("Contract connectivity test failed, contract may not be deployed at the specified address:", error);
        return [];
      }
      
      // Try to get donation count with fallback
      let donationCount = 0;
      try {
        const countResult = await this.charityContract.methods.getDonationCount().call();
        donationCount = Number(countResult);
      } catch (error) {
        console.warn("Could not get donation count, contract may not have this method:", error);
        
        // Try an alternative approach - check if we can get a donation at index 0
        try {
          await this.charityContract.methods.getDonation(0).call();
          // If we get here, at least one donation exists
          donationCount = 1;
        } catch (donationError) {
          console.warn("Could not get donation at index 0, assuming no donations exist:", donationError);
          return [];
        }
      }
      
      // If we have no donations, return empty array
      if (donationCount <= 0) {
        return [];
      }
      
      console.log(`Found ${donationCount} donations, attempting to retrieve them`);
      
      // Try to get donations with a more cautious approach
      const donations: Donation[] = [];
      let successfulFetches = 0;
      
      // Only try to fetch the first 100 donations to avoid excessive requests
      const maxToFetch = Math.min(donationCount, 100);
      
      for (let i = 0; i < maxToFetch; i++) {
        try {
          const donation = await this.charityContract.methods.getDonation(i).call();
          
          donations.push({
            id: i,
            donor: donation.donor,
            charityId: Number(donation.charityId),
            amount: Number(donation.amount),
            timestamp: Number(donation.timestamp),
            isEth: donation.isEth,
          });
          
          successfulFetches++;
        } catch (error) {
          console.warn(`Error fetching donation ${i}, skipping:`, error);
          // Continue with the next donation
        }
        
        // If we've had 5 consecutive failures, assume the rest will fail too
        if (successfulFetches === 0 && i >= 5) {
          console.warn("Multiple consecutive donation fetch failures, stopping");
          break;
        }
      }
      
      console.log(`Successfully retrieved ${donations.length} out of ${donationCount} donations`);
      return donations;
    } catch (error) {
      console.error("Failed to get donations:", error);
      return [];
    }
  }

  // Make USDC donation
  async donate(charityId: number, amount: number): Promise<string> {
    if (!this.web3 || !this.charityContract || !this.state.account) {
      throw new Error("Web3 not initialized or not connected");
    }

    try {
      // Approve USDC transfer
      const addresses = getContractAddresses();
      const usdcContract = new this.web3.eth.Contract(
        [
          {
            constant: false,
            inputs: [
              { name: "_spender", type: "address" },
              { name: "_value", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
        ] as AbiItem[],
        addresses.USDC
      );

      await usdcContract.methods
        .approve(addresses.CharityDonation, amount)
        .send({ from: this.state.account });

      // Make donation
      const tx = await this.charityContract.methods
        .donateUsdc(charityId, amount)
        .send({ from: this.state.account });

      return tx.transactionHash;
    } catch (error) {
      console.error("Failed to make donation:", error);
      throw error;
    }
  }

  // Make ETH donation
  async donateEth(charityId: number, amount: number): Promise<string> {
    if (!this.web3 || !this.charityContract || !this.state.account) {
      throw new Error("Web3 not initialized or not connected");
    }

    try {
      // Make donation
      const tx = await this.charityContract.methods
        .donateEth(charityId)
        .send({ from: this.state.account, value: amount });

      return tx.transactionHash;
    } catch (error) {
      console.error("Failed to make ETH donation:", error);
      throw error;
    }
  }

  // Event handlers
  private handleAccountsChanged = (accounts: string[]) => {
    this.updateState({
      ...this.state,
      account: accounts.length > 0 ? accounts[0] : null,
      isConnected: accounts.length > 0,
    });
  };

  private handleChainChanged = (chainId: string) => {
    this.updateState({
      ...this.state,
      chainId: parseInt(chainId, 16),
    });
    window.location.reload();
  };

  private handleDisconnect = () => {
    this.updateState({
      isConnected: false,
      account: null,
      chainId: null,
      error: null,
    });
  };

  // State management
  private updateState(newState: Web3State): void {
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Subscribe to state changes
  subscribe(listener: (state: Web3State) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Get current state
  getState(): Web3State {
    return this.state;
  }
}

// Create singleton instance
const web3Service = new Web3Service();

export default web3Service;
