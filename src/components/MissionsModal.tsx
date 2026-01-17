import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, Gift } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MissionsModal: React.FC<MissionsModalProps> = ({ open, onOpenChange }) => {
  const { missions, claimMissionReward } = useGame();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const dailyMissions = missions.filter(m => m.type === 'daily');
  const weeklyMissions = missions.filter(m => m.type === 'weekly');
  const activeMissions = activeTab === 'daily' ? dailyMissions : weeklyMissions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Missions
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'daily' | 'weekly')} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger 
                value="daily" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <Clock className="w-4 h-4 mr-2" />
                Daily Challenges
              </TabsTrigger>
              <TabsTrigger 
                value="weekly"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <Gift className="w-4 h-4 mr-2" />
                Weekly Quests
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {activeMissions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card-hover p-4 rounded-xl ${
                      mission.claimed ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {mission.claimed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : mission.completed ? (
                            <Gift className="w-5 h-5 text-primary flex-shrink-0 animate-pulse" />
                          ) : (
                            <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <h3 className="font-semibold truncate">{mission.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {mission.progress} / {mission.target}
                            </span>
                          </div>
                          <Progress 
                            value={(mission.progress / mission.target) * 100} 
                            className="h-2 bg-muted"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted/50 text-sm">
                          <span>{mission.rewardType === 'igc' ? '💎' : '⚡'}</span>
                          <span className="font-semibold">{mission.reward}</span>
                        </div>
                        
                        {mission.completed && !mission.claimed && (
                          <Button
                            size="sm"
                            onClick={() => claimMissionReward(mission.id)}
                            className="cyber-button text-white text-xs px-3 py-1"
                          >
                            Claim
                          </Button>
                        )}
                        
                        {mission.claimed && (
                          <span className="text-xs text-green-500 font-medium">Claimed!</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MissionsModal;
