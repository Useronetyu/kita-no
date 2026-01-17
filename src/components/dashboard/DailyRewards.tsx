import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Gift, Check, Lock } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

const rewards = [10, 20, 30, 40, 50, 75, 200];

const DailyRewards: React.FC = () => {
  const { dailyStreak, canClaimDaily, claimDailyReward } = useGame();
  const nextDay = Math.min(dailyStreak + 1, 7);

  return (
    <div className="glass-card-hover p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Daily Rewards</h3>
          <p className="text-sm text-muted-foreground">Streak: {dailyStreak} days</p>
        </div>
      </div>

      {/* 7-Day Calendar */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {rewards.map((reward, index) => {
          const day = index + 1;
          const isClaimed = day <= dailyStreak;
          const isCurrent = day === nextDay && canClaimDaily;
          const isLocked = day > nextDay;
          const isBonus = day === 7;

          return (
            <motion.div
              key={day}
              whileHover={isCurrent ? { scale: 1.05 } : {}}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all ${
                isClaimed
                  ? 'bg-green-500/20 border border-green-500/50'
                  : isCurrent
                  ? 'bg-primary/20 border-2 border-primary animate-pulse cursor-pointer'
                  : isLocked
                  ? 'bg-muted/30 border border-border/50 opacity-50'
                  : 'bg-muted/30 border border-border/50'
              } ${isBonus ? 'ring-2 ring-yellow-500/50' : ''}`}
              onClick={() => isCurrent && claimDailyReward(day)}
            >
              <span className="text-[10px] text-muted-foreground mb-0.5">Day {day}</span>
              {isClaimed ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : isLocked ? (
                <Lock className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Gift className={`w-4 h-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
              <span className={`text-[10px] font-bold ${isBonus ? 'text-yellow-500' : ''}`}>
                {reward}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Claim Button */}
      <div className="space-y-2">
        {canClaimDaily && dailyStreak < 7 && (
          <Button
            onClick={() => claimDailyReward(nextDay)}
            className="w-full cyber-button text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Claim Day {nextDay} Reward ({rewards[nextDay - 1]} IGC)
          </Button>
        )}
        
        {!canClaimDaily && (
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Come back tomorrow for your next reward!
            </p>
          </div>
        )}
        
        {dailyStreak >= 7 && (
          <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm text-yellow-500 font-medium">
              🎉 Weekly streak complete! Resets tomorrow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyRewards;
