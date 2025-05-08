import React, { createContext, useContext, useEffect, useState } from 'react';
import web3Service, { Web3State } from '@/lib/web3';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

// Create context
interface Web3ContextType {
  web3State: Web3State;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Provider component
export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    account: null,
    chainId: null,
    error: null,
  });

  useEffect(() => {
    // Initialize Web3
    web3Service.initialize();

    // Subscribe to state changes
    const unsubscribe = web3Service.subscribe((state) => {
      setWeb3State(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const connectWallet = async () => {
    return await web3Service.connectWallet();
  };

  const disconnectWallet = () => {
    web3Service.disconnectWallet();
  };

  return (
    <Web3Context.Provider value={{ web3State, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

// Hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Wallet connect button component
export const WalletConnectButton: React.FC = () => {
  const { web3State, connectWallet, disconnectWallet } = useWeb3();

  const handleClick = async () => {
    if (web3State.isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={web3State.isConnected ? 'outline' : 'default'}
      className="flex items-center gap-2"
    >
      <Wallet size={16} />
      {web3State.isConnected
        ? `${web3State.account?.substring(0, 6)}...${web3State.account?.substring(38)}`
        : 'Connect Wallet'}
    </Button>
  );
};

// Network status component
export const NetworkStatus: React.FC = () => {
  const { web3State } = useWeb3();

  if (!web3State.isConnected) {
    return null;
  }

  const getNetworkName = (chainId: number | null) => {
    if (!chainId) return 'Unknown';
    
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Mumbai Testnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  return (
    <div className="text-xs text-gray-500">
      {getNetworkName(web3State.chainId)}
    </div>
  );
};

export default Web3Provider;
