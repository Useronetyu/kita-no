import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, TrendingUp, Zap } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const StakingVault: React.FC = () => {
  const { igc, stakedIgc, miningBoost, stakeIgc, unstakeIgc } = useGame();
  const [stakeAmount, setStakeAmount] = useState('');

  const handleStake = () => {
    const amount = parseInt(stakeAmount);
    if (amount > 0 && stakeIgc(amount)) {
      setStakeAmount('');
    }
  };

  const handleMaxStake = () => {
    setStakeAmount(igc.toString());
  };

  return (
    <div className="glass-card-hover p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Lock className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Staking Vault</h3>
          <p className="text-sm text-muted-foreground">Lock IGC for mining boosts</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Staking Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Staked IGC</p>
            <p className="text-xl font-bold text-green-500">🔒 {stakedIgc.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Mining Boost</p>
            <div className="flex items-center gap-1 text-xl font-bold text-primary">
              <TrendingUp className="w-5 h-5" />
              {miningBoost}x
            </div>
          </div>
        </div>

        {/* Boost Explanation */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Every <span className="text-primary font-semibold">100 IGC</span> staked = <span className="text-primary font-semibold">+1x</span> mining boost
            </span>
          </div>
        </div>

        {/* Stake Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="pr-16 bg-muted/30 border-border/50"
            />
            <button
              onClick={handleMaxStake}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80 font-medium"
            >
              MAX
            </button>
          </div>
          <Button
            onClick={handleStake}
            disabled={!stakeAmount || parseInt(stakeAmount) <= 0 || parseInt(stakeAmount) > igc}
            className="cyber-button text-white"
          >
            <Lock className="w-4 h-4 mr-1" />
            Stake
          </Button>
        </div>

        {/* Available Balance */}
        <p className="text-xs text-muted-foreground text-center">
          Available: {igc.toLocaleString()} IGC
        </p>

        {/* Unstake Button */}
        {stakedIgc > 0 && (
          <Button
            onClick={unstakeIgc}
            variant="outline"
            className="w-full border-green-500/30 text-green-500 hover:bg-green-500/10"
          >
            <Unlock className="w-4 h-4 mr-2" />
            Unstake All ({stakedIgc.toLocaleString()} IGC)
          </Button>
        )}
      </div>
    </div>
  );
};

export default StakingVault;
