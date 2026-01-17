import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import SpinWheel from '@/components/arcade/SpinWheel';
import Blackjack from '@/components/arcade/Blackjack';
import DiceRoll from '@/components/arcade/DiceRoll';
import CoinFlip from '@/components/arcade/CoinFlip';
import ClickerBlitz from '@/components/arcade/ClickerBlitz';

const games = [
  { id: 'spin', name: 'Spin the Wheel', icon: '🎡', component: SpinWheel },
  { id: 'blackjack', name: 'Blackjack', icon: '🃏', component: Blackjack },
  { id: 'dice', name: 'Dice Roll', icon: '🎲', component: DiceRoll },
  { id: 'coin', name: 'Coin Flip', icon: '🪙', component: CoinFlip },
  { id: 'clicker', name: 'Clicker Blitz', icon: '⚡', component: ClickerBlitz },
];

const Arcade: React.FC = () => {
  const { isConnected } = useWeb3();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 gradient-text">Connect to Play</h2>
          <p className="text-muted-foreground">
            Connect your wallet to access the arcade and win IGC.
          </p>
        </motion.div>
      </div>
    );
  }

  const SelectedGameComponent = selectedGame 
    ? games.find(g => g.id === selectedGame)?.component 
    : null;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Arcade</h1>
          <p className="text-muted-foreground">Play games and win IGC tokens</p>
        </motion.div>

        {selectedGame && SelectedGameComponent ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedGame(null)}
              className="text-primary hover:text-primary/80 flex items-center gap-2"
            >
              ← Back to Games
            </button>
            <SelectedGameComponent />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedGame(game.id)}
                className="glass-card-hover p-6 cursor-pointer group"
              >
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    {game.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">Click to play</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Arcade;
