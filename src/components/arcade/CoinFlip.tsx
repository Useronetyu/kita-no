import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CoinFlip: React.FC = () => {
  const { igc, addIgc, removeIgc } = useGame();
  const [bet, setBet] = useState('10');
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<'heads' | 'tails'>('heads');
  const [result, setResult] = useState<string | null>(null);

  const flip = () => {
    const betAmount = parseInt(bet);
    if (!choice || betAmount <= 0 || betAmount > igc || isFlipping) return;
    
    removeIgc(betAmount, 'Coin Flip bet');
    setIsFlipping(true);
    setResult(null);
    
    setTimeout(() => {
      const outcome: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoinSide(outcome);
      
      setTimeout(() => {
        if (choice === outcome) {
          addIgc(betAmount * 2, `Won ${betAmount * 2} IGC on Coin Flip`);
          setResult(`🎉 It's ${outcome}! You win ${betAmount * 2} IGC!`);
        } else {
          setResult(`😢 It's ${outcome}. You lose!`);
        }
        setIsFlipping(false);
      }, 500);
    }, 2000);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold gradient-text mb-6 text-center">🪙 Coin Flip</h2>
      
      <div className="flex flex-col items-center gap-6">
        {/* Coin */}
        <motion.div
          animate={isFlipping ? { 
            rotateX: [0, 1800],
            scale: [1, 1.3, 1]
          } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-xl"
          style={{
            background: coinSide === 'heads' 
              ? 'linear-gradient(135deg, #fbbf24, #d97706)' 
              : 'linear-gradient(135deg, #9ca3af, #6b7280)',
          }}
        >
          {coinSide === 'heads' ? '👑' : '🦅'}
        </motion.div>

        {/* Bet Input */}
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            className="w-32 bg-muted/30"
            disabled={isFlipping}
          />
          <span className="text-muted-foreground">IGC</span>
        </div>

        {/* Choice Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setChoice('heads')}
            variant={choice === 'heads' ? 'default' : 'outline'}
            disabled={isFlipping}
            className={choice === 'heads' ? 'cyber-button text-white' : ''}
          >
            👑 Heads
          </Button>
          <Button
            onClick={() => setChoice('tails')}
            variant={choice === 'tails' ? 'default' : 'outline'}
            disabled={isFlipping}
            className={choice === 'tails' ? 'cyber-button text-white' : ''}
          >
            🦅 Tails
          </Button>
        </div>

        {/* Flip Button */}
        <Button
          onClick={flip}
          disabled={!choice || parseInt(bet) <= 0 || parseInt(bet) > igc || isFlipping}
          className="cyber-button text-white px-8"
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </Button>

        {/* Result */}
        {result && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg font-bold ${result.includes('win') ? 'text-green-500' : 'text-red-500'}`}
          >
            {result}
          </motion.p>
        )}

        <p className="text-sm text-muted-foreground">Balance: {igc} IGC</p>
      </div>
    </div>
  );
};

export default CoinFlip;
