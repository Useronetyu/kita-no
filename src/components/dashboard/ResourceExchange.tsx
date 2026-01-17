import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Zap, Gem, ArrowRight } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

const ResourceExchange: React.FC = () => {
  const { resources, igc, exchangeResources } = useGame();
  const [exchangeCount, setExchangeCount] = useState(0);
  const canExchange = resources >= 100;

  const handleExchange = () => {
    if (exchangeResources()) {
      setExchangeCount(prev => prev + 1);
    }
  };

  const maxExchanges = Math.floor(resources / 100);

  return (
    <div className="glass-card-hover p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Resource Exchange</h3>
          <p className="text-sm text-muted-foreground">Convert resources to IGC</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Exchange Rate Display */}
        <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted/30">
          <div className="text-center">
            <div className="flex items-center gap-1 text-2xl font-bold text-primary">
              <Zap className="w-6 h-6" />
              100
            </div>
            <p className="text-xs text-muted-foreground">Resources</p>
          </div>
          
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </motion.div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 text-2xl font-bold text-secondary">
              <Gem className="w-6 h-6" />
              1
            </div>
            <p className="text-xs text-muted-foreground">IGC</p>
          </div>
        </div>

        {/* Current Balance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">Available</p>
            <p className="font-bold text-primary">⚡ {resources.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">IGC Balance</p>
            <p className="font-bold text-secondary">💎 {igc.toLocaleString()}</p>
          </div>
        </div>

        {/* Exchange Button */}
        <Button
          onClick={handleExchange}
          disabled={!canExchange}
          className={`w-full ${canExchange ? 'cyber-button text-white' : ''}`}
          variant={canExchange ? 'default' : 'secondary'}
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          {canExchange 
            ? `Exchange (${maxExchanges} available)` 
            : 'Need 100 Resources'
          }
        </Button>

        {/* Exchange Stats */}
        {exchangeCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground"
          >
            Exchanged {exchangeCount} time{exchangeCount > 1 ? 's' : ''} this session
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default ResourceExchange;
