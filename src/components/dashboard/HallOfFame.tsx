import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

const HallOfFame: React.FC = () => {
  const { achievements } = useGame();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Hall of Fame</h3>
            <p className="text-sm text-muted-foreground">
              {unlockedCount} / {achievements.length} achievements unlocked
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer group ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30'
                : 'bg-muted/30 border border-border/30'
            }`}
          >
            <div className={`text-3xl mb-1 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
              {achievement.icon}
            </div>
            
            {!achievement.unlocked && (
              <Lock className="w-3 h-3 text-muted-foreground absolute top-2 right-2" />
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-popover border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              <p className="font-medium text-sm">{achievement.name}</p>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HallOfFame;
