import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pickaxe, Zap, Sparkles } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const MiningZone: React.FC = () => {
  const { mine, resources, miningBoost, totalMined } = useGame();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMining, setIsMining] = useState(false);

  const handleMine = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setIsMining(true);
    
    // Create particles
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * -50 - 20,
      color: ['#a855f7', '#3b82f6', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 4)],
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Clear particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
    
    mine();
    
    setTimeout(() => setIsMining(false), 150);
  }, [mine]);

  return (
    <div className="glass-card-hover p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Pickaxe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Mining Zone</h3>
          <p className="text-sm text-muted-foreground">Click to mine resources</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Resources</p>
            <p className="text-xl font-bold text-primary">⚡ {resources.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Mining Boost</p>
            <p className="text-xl font-bold text-secondary">{miningBoost}x</p>
          </div>
        </div>

        {/* Mining Button */}
        <div className="relative flex justify-center py-4">
          <AnimatePresence>
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{ backgroundColor: particle.color }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ 
                  opacity: 0, 
                  x: particle.x, 
                  y: particle.y, 
                  scale: 0 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleMine}
              className={`cyber-button text-white w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 ${
                isMining ? 'mining-pulse' : ''
              }`}
            >
              <motion.div
                animate={isMining ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.15 }}
              >
                <Pickaxe className="w-10 h-10" />
              </motion.div>
              <span className="font-bold">Mine</span>
              <span className="text-sm opacity-80">+{10 * miningBoost} ⚡</span>
            </Button>
          </motion.div>
        </div>

        {/* Total Mined */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span>Total mined: {totalMined.toLocaleString()} resources</span>
        </div>
      </div>
    </div>
  );
};

export default MiningZone;
