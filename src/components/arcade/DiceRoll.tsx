import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DiceRoll: React.FC = () => {
  const { igc, addIgc, removeIgc } = useGame();
  const [bet, setBet] = useState('10');
  const [guess, setGuess] = useState<'high' | 'low' | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [result, setResult] = useState<string | null>(null);

  const roll = () => {
    const betAmount = parseInt(bet);
    if (!guess || betAmount <= 0 || betAmount > igc || isRolling) return;
    
    removeIgc(betAmount, 'Dice Roll bet');
    setIsRolling(true);
    setResult(null);
    
    // Animate dice
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 15) {
        clearInterval(rollInterval);
        
        const finalDice1 = Math.floor(Math.random() * 6) + 1;
        const finalDice2 = Math.floor(Math.random() * 6) + 1;
        setDice1(finalDice1);
        setDice2(finalDice2);
        
        const total = finalDice1 + finalDice2;
        const isHigh = total >= 7;
        const won = (guess === 'high' && isHigh) || (guess === 'low' && !isHigh);
        
        if (won) {
          addIgc(betAmount * 2, `Won ${betAmount * 2} IGC on Dice Roll`);
          setResult(`🎉 You rolled ${total}! You win ${betAmount * 2} IGC!`);
        } else {
          setResult(`😢 You rolled ${total}. Better luck next time!`);
        }
        
        setIsRolling(false);
      }
    }, 100);
  };

  const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold gradient-text mb-6 text-center">🎲 Dice Roll</h2>
      
      <div className="flex flex-col items-center gap-6">
        {/* Dice Display */}
        <div className="flex gap-4">
          <motion.div
            animate={isRolling ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.1, repeat: isRolling ? Infinity : 0 }}
            className="text-6xl"
          >
            {diceEmojis[dice1 - 1]}
          </motion.div>
          <motion.div
            animate={isRolling ? { rotate: [360, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.1, repeat: isRolling ? Infinity : 0 }}
            className="text-6xl"
          >
            {diceEmojis[dice2 - 1]}
          </motion.div>
        </div>

        {/* Bet Input */}
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            className="w-32 bg-muted/30"
            disabled={isRolling}
          />
          <span className="text-muted-foreground">IGC</span>
        </div>

        {/* Guess Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setGuess('low')}
            variant={guess === 'low' ? 'default' : 'outline'}
            disabled={isRolling}
            className={guess === 'low' ? 'cyber-button text-white' : ''}
          >
            Low (2-6)
          </Button>
          <Button
            onClick={() => setGuess('high')}
            variant={guess === 'high' ? 'default' : 'outline'}
            disabled={isRolling}
            className={guess === 'high' ? 'cyber-button text-white' : ''}
          >
            High (7-12)
          </Button>
        </div>

        {/* Roll Button */}
        <Button
          onClick={roll}
          disabled={!guess || parseInt(bet) <= 0 || parseInt(bet) > igc || isRolling}
          className="cyber-button text-white px-8"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
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

export default DiceRoll;
