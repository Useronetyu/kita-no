import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Web3ContextType {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isSimulation: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (args: unknown) => void) => void;
      removeListener: (event: string, callback: (args: unknown) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (wei: string): string => {
    const eth = parseInt(wei, 16) / 1e18;
    return eth.toFixed(4);
  };

  const getBalance = async (addr: string): Promise<string> => {
    if (!window.ethereum) return '0.00';
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest'],
      });
      return formatBalance(balance as string);
    } catch {
      return '0.00';
    }
  };

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    
    // Check if MetaMask is available
    if (window.ethereum?.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        
        if (accounts && accounts.length > 0) {
          const addr = accounts[0];
          const bal = await getBalance(addr);
          setAddress(formatAddress(addr));
          setBalance(bal);
          setIsConnected(true);
          setIsSimulation(false);
          setIsConnecting(false);
          return;
        }
      } catch (error) {
        console.log('MetaMask connection failed, falling back to simulation');
      }
    }
    
    // Fallback to simulation after 3 seconds
    setTimeout(() => {
      const simulatedAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f8aB89';
      const simulatedBalance = (Math.random() * 10 + 0.5).toFixed(4);
      setAddress(formatAddress(simulatedAddress));
      setBalance(simulatedBalance);
      setIsConnected(true);
      setIsSimulation(true);
      setIsConnecting(false);
    }, 3000);
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setBalance('0.00');
    setIsConnected(false);
    setIsSimulation(false);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountsArray = accounts as string[];
        if (accountsArray.length === 0) {
          disconnectWallet();
        } else if (accountsArray[0] !== address) {
          const newAddr = accountsArray[0];
          setAddress(formatAddress(newAddr));
          getBalance(newAddr).then(setBalance);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [address, disconnectWallet]);

  return (
    <Web3Context.Provider
      value={{
        address,
        balance,
        isConnected,
        isSimulation,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
