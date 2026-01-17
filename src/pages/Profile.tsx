import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, History, Send, Shield, Star, Award, Crown } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const rankBadges = [
  { name: 'Bronze', minIgc: 0, icon: '🥉', color: 'from-orange-600 to-orange-800' },
  { name: 'Silver', minIgc: 100, icon: '🥈', color: 'from-gray-400 to-gray-600' },
  { name: 'Gold', minIgc: 500, icon: '🥇', color: 'from-yellow-400 to-yellow-600' },
  { name: 'Platinum', minIgc: 1000, icon: '💎', color: 'from-cyan-400 to-cyan-600' },
  { name: 'Diamond', minIgc: 5000, icon: '💠', color: 'from-blue-400 to-purple-600' },
  { name: 'Master', minIgc: 10000, icon: '👑', color: 'from-purple-500 to-pink-600' },
];

const Profile: React.FC = () => {
  const { isConnected, address, balance, isSimulation } = useWeb3();
  const { igc, resources, stakedIgc, totalMined, gamesPlayed, gamesWon, transactions, achievements } = useGame();
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 gradient-text">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view your profile.
          </p>
        </motion.div>
      </div>
    );
  }

  const currentRank = [...rankBadges].reverse().find(r => igc >= r.minIgc) || rankBadges[0];
  const nextRank = rankBadges.find(r => r.minIgc > igc);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  const handleTransfer = () => {
    // Simulated transfer - in real app would use web3
    alert(`Transfer simulation: ${transferAmount} IGC to ${transferAddress}`);
    setTransferAddress('');
    setTransferAmount('');
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Profile</h1>
          <p className="text-muted-foreground">Your stats, achievements, and history</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar & Rank */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentRank.color} flex items-center justify-center text-4xl shadow-lg`}>
                {currentRank.icon}
              </div>
              {isSimulation && (
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded-full">
                  SIM
                </span>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold">{address}</h2>
              <p className="text-muted-foreground">{balance} ETH</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${currentRank.color} text-white`}>
                  {currentRank.name} Rank
                </span>
                {nextRank && (
                  <span className="text-xs text-muted-foreground">
                    {nextRank.minIgc - igc} IGC to {nextRank.name}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-2xl font-bold text-primary">💎 {igc.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">IGC Balance</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-2xl font-bold text-secondary">⚡ {resources.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Resources</p>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50">
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary/20">
              <Trophy className="w-4 h-4 mr-2 hidden sm:inline" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="ranks" className="data-[state=active]:bg-primary/20">
              <Crown className="w-4 h-4 mr-2 hidden sm:inline" />
              Ranks
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary/20">
              <History className="w-4 h-4 mr-2 hidden sm:inline" />
              History
            </TabsTrigger>
            <TabsTrigger value="transfer" className="data-[state=active]:bg-primary/20">
              <Send className="w-4 h-4 mr-2 hidden sm:inline" />
              Transfer
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalMined.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Mined</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{gamesWon}/{gamesPlayed}</p>
                    <p className="text-xs text-muted-foreground">Games Won ({winRate}%)</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stakedIgc.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Staked IGC</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{unlockedAchievements}/{achievements.length}</p>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Ranks Tab */}
          <TabsContent value="ranks">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rankBadges.map((rank, index) => {
                const isUnlocked = igc >= rank.minIgc;
                const isCurrent = rank.name === currentRank.name;
                
                return (
                  <motion.div
                    key={rank.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card p-4 text-center ${!isUnlocked ? 'opacity-50 grayscale' : ''} ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${rank.color} flex items-center justify-center text-3xl mb-3`}>
                      {rank.icon}
                    </div>
                    <h4 className="font-bold">{rank.name}</h4>
                    <p className="text-sm text-muted-foreground">{rank.minIgc.toLocaleString()} IGC</p>
                    {isCurrent && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="glass-card overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No transactions yet
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          tx.type === 'win' || tx.type === 'claim' ? 'bg-green-500/20 text-green-500' :
                          tx.type === 'loss' ? 'bg-red-500/20 text-red-500' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {tx.type === 'mine' && '⛏️'}
                          {tx.type === 'exchange' && '🔄'}
                          {tx.type === 'stake' && '🔒'}
                          {tx.type === 'unstake' && '🔓'}
                          {tx.type === 'win' && '🎉'}
                          {tx.type === 'loss' && '😢'}
                          {tx.type === 'mint' && '✨'}
                          {tx.type === 'buy' && '🛒'}
                          {tx.type === 'sell' && '💰'}
                          {tx.type === 'claim' && '🎁'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold ${
                        tx.type === 'loss' || tx.type === 'buy' || tx.type === 'stake' || tx.type === 'mint'
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}>
                        {tx.type === 'loss' || tx.type === 'buy' || tx.type === 'stake' || tx.type === 'mint' ? '-' : '+'}
                        {tx.amount} {tx.currency === 'igc' ? 'IGC' : '⚡'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 max-w-md mx-auto"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Transfer IGC
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Recipient Address</label>
                  <Input
                    placeholder="0x..."
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    className="bg-muted/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Amount</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="0"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="bg-muted/30"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setTransferAmount(igc.toString())}
                      className="shrink-0"
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {igc.toLocaleString()} IGC
                  </p>
                </div>

                <Button
                  onClick={handleTransfer}
                  disabled={!transferAddress || !transferAmount || parseInt(transferAmount) <= 0 || parseInt(transferAmount) > igc}
                  className="w-full cyber-button text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Transfer
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  ⚠️ This is a simulation - no real tokens will be transferred
                </p>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
