import React from 'react';
import { motion } from 'framer-motion';
import MiningZone from '@/components/dashboard/MiningZone';
import DailyRewards from '@/components/dashboard/DailyRewards';
import ResourceExchange from '@/components/dashboard/ResourceExchange';
import StakingVault from '@/components/dashboard/StakingVault';
import HallOfFame from '@/components/dashboard/HallOfFame';
import { useWeb3 } from '@/contexts/Web3Context';

const Dashboard: React.FC = () => {
  const { isConnected } = useWeb3();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 gradient-text">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to access the CyberCoin dashboard and start earning rewards.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your resources and grow your IGC empire</p>
        </motion.div>

        {/* Main 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MiningZone />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DailyRewards />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ResourceExchange />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StakingVault />
          </motion.div>
        </div>

        {/* Hall of Fame - Full Width Below Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-full"
        >
          <HallOfFame />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
