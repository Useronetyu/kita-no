import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ClickerBlitz: React.FC = () => {
  const { igc, addIgc, removeIgc } = useGame();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(0);
  const entryCost = 5;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    if (igc < entryCost) return;
    removeIgc(entryCost, 'Clicker Blitz entry fee');
    setClicks(0);
    setTimeLeft(30);
    setGameState('playing');
  };

  const handleClick = useCallback(() => {
    if (gameState === 'playing') {
      setClicks(prev => prev + 1);
    }
  }, [gameState]);

  const endGame = () => {
    setGameState('finished');
    
    // Calculate reward based on clicks
    let reward = 0;
    if (clicks >= 150) reward = 50;
    else if (clicks >= 100) reward = 25;
    else if (clicks >= 75) reward = 15;
    else if (clicks >= 50) reward = 10;
    else if (clicks >= 30) reward = 5;
    
    if (reward > 0) {
      addIgc(reward, `Clicker Blitz - ${clicks} clicks`);
    }
    
    if (clicks > highScore) {
      setHighScore(clicks);
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setClicks(0);
    setTimeLeft(30);
  };

  const getRewardTier = () => {
    if (clicks >= 150) return { tier: 'MASTER', reward: 50, color: 'text-purple-500' };
    if (clicks >= 100) return { tier: 'EXPERT', reward: 25, color: 'text-yellow-500' };
    if (clicks >= 75) return { tier: 'PRO', reward: 15, color: 'text-blue-500' };
    if (clicks >= 50) return { tier: 'GOOD', reward: 10, color: 'text-green-500' };
    if (clicks >= 30) return { tier: 'OK', reward: 5, color: 'text-gray-400' };
    return { tier: 'TRY HARDER', reward: 0, color: 'text-red-500' };
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold gradient-text mb-6 text-center">⚡ Clicker Blitz</h2>
      
      <div className="flex flex-col items-center gap-6">
        {gameState === 'idle' && (
          <>
            <p className="text-muted-foreground text-center max-w-sm">
              Click as fast as you can in 30 seconds! More clicks = bigger rewards.
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-muted-foreground">30+ clicks</p>
                <p className="font-bold">5 IGC</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-muted-foreground">50+ clicks</p>
                <p className="font-bold">10 IGC</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-muted-foreground">100+ clicks</p>
                <p className="font-bold">25 IGC</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-muted-foreground">150+ clicks</p>
                <p className="font-bold text-purple-500">50 IGC</p>
              </div>
            </div>
            
            {highScore > 0 && (
              <p className="text-sm text-muted-foreground">
                🏆 Your best: {highScore} clicks
              </p>
            )}
            
            <Button
              onClick={startGame}
              disabled={igc < entryCost}
              className="cyber-button text-white px-8"
            >
              Start ({entryCost} IGC)
            </Button>
          </>
        )}

        {gameState === 'playing' && (
          <>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time Left</span>
                <span className="font-bold">{timeLeft}s</span>
              </div>
              <Progress value={(timeLeft / 30) * 100} className="h-3" />
            </div>

            <div className="text-center">
              <p className="text-5xl font-bold gradient-text">{clicks}</p>
              <p className="text-muted-foreground">clicks</p>
            </div>

            <motion.button
              onClick={handleClick}
              whileTap={{ scale: 0.9 }}
              className="w-48 h-48 rounded-full cyber-button text-white text-2xl font-bold"
            >
              CLICK!
            </motion.button>
          </>
        )}

        {gameState === 'finished' && (
          <>
            <div className="text-center">
              <p className="text-5xl font-bold gradient-text mb-2">{clicks}</p>
              <p className="text-muted-foreground mb-4">clicks in 30 seconds</p>
              
              <div className={`text-2xl font-bold ${getRewardTier().color}`}>
                {getRewardTier().tier}
              </div>
              
              {getRewardTier().reward > 0 ? (
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-green-500 text-lg mt-2"
                >
                  🎉 +{getRewardTier().reward} IGC
                </motion.p>
              ) : (
                <p className="text-red-500 text-sm mt-2">
                  Need at least 30 clicks to win
                </p>
              )}
            </div>
            
            <Button onClick={resetGame} className="cyber-button text-white">
              Play Again
            </Button>
          </>
        )}

        <p className="text-sm text-muted-foreground">Balance: {igc} IGC</p>
      </div>
    </div>
  );
};

export default ClickerBlitz;
