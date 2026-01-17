import React, { createContext, useContext, useState, useCallback } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  type: 'mining' | 'games' | 'trading' | 'staking';
}

interface Transaction {
  id: string;
  type: 'mine' | 'exchange' | 'stake' | 'unstake' | 'win' | 'loss' | 'mint' | 'buy' | 'sell' | 'claim';
  amount: number;
  currency: 'resources' | 'igc';
  timestamp: Date;
  description: string;
}

interface NFT {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  price?: number;
  forSale: boolean;
  ownerId: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  progress: number;
  target: number;
  reward: number;
  rewardType: 'igc' | 'resources';
  completed: boolean;
  claimed: boolean;
}

interface GameContextType {
  // Currency
  resources: number;
  igc: number;
  stakedIgc: number;
  miningBoost: number;
  
  // Stats
  totalMined: number;
  gamesPlayed: number;
  gamesWon: number;
  
  // Daily rewards
  dailyStreak: number;
  lastDailyReward: Date | null;
  canClaimDaily: boolean;
  
  // Achievements & History
  achievements: Achievement[];
  transactions: Transaction[];
  nfts: NFT[];
  globalNfts: NFT[];
  missions: Mission[];
  
  // Actions
  mine: () => void;
  exchangeResources: () => boolean;
  stakeIgc: (amount: number) => boolean;
  unstakeIgc: () => void;
  claimDailyReward: (day: number) => void;
  addIgc: (amount: number, description: string) => void;
  removeIgc: (amount: number, description: string) => boolean;
  mintNft: () => boolean;
  listNftForSale: (nftId: string, price: number) => void;
  buyNft: (nftId: string) => boolean;
  updateMissionProgress: (missionId: string, progress: number) => void;
  claimMissionReward: (missionId: string) => void;
  playSound: (type: 'mine' | 'coin' | 'win' | 'lose' | 'click') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialAchievements: Achievement[] = [
  { id: '1', name: 'First Steps', description: 'Mine 100 resources', icon: '⛏️', unlocked: false, requirement: 100, type: 'mining' },
  { id: '2', name: 'Miner Pro', description: 'Mine 1,000 resources', icon: '💎', unlocked: false, requirement: 1000, type: 'mining' },
  { id: '3', name: 'Mining Legend', description: 'Mine 10,000 resources', icon: '🏆', unlocked: false, requirement: 10000, type: 'mining' },
  { id: '4', name: 'Lucky Start', description: 'Win 5 games', icon: '🍀', unlocked: false, requirement: 5, type: 'games' },
  { id: '5', name: 'High Roller', description: 'Win 50 games', icon: '🎰', unlocked: false, requirement: 50, type: 'games' },
  { id: '6', name: 'First Trade', description: 'Complete 1 trade', icon: '🔄', unlocked: false, requirement: 1, type: 'trading' },
  { id: '7', name: 'Staker', description: 'Stake 100 IGC', icon: '🔒', unlocked: false, requirement: 100, type: 'staking' },
  { id: '8', name: 'Diamond Hands', description: 'Stake 1,000 IGC', icon: '💪', unlocked: false, requirement: 1000, type: 'staking' },
];

const initialMissions: Mission[] = [
  { id: 'd1', title: 'Daily Miner', description: 'Mine 50 resources', type: 'daily', progress: 0, target: 50, reward: 5, rewardType: 'igc', completed: false, claimed: false },
  { id: 'd2', title: 'Lucky Spin', description: 'Play 3 arcade games', type: 'daily', progress: 0, target: 3, reward: 10, rewardType: 'igc', completed: false, claimed: false },
  { id: 'd3', title: 'Exchange Master', description: 'Exchange resources 2 times', type: 'daily', progress: 0, target: 2, reward: 100, rewardType: 'resources', completed: false, claimed: false },
  { id: 'w1', title: 'Weekly Grind', description: 'Mine 500 resources', type: 'weekly', progress: 0, target: 500, reward: 50, rewardType: 'igc', completed: false, claimed: false },
  { id: 'w2', title: 'Arcade Champion', description: 'Win 10 games', type: 'weekly', progress: 0, target: 10, reward: 100, rewardType: 'igc', completed: false, claimed: false },
  { id: 'w3', title: 'NFT Collector', description: 'Mint 3 NFTs', type: 'weekly', progress: 0, target: 3, reward: 200, rewardType: 'igc', completed: false, claimed: false },
];

const generateRandomNft = (id: string, ownerId: string = 'global'): NFT => {
  const rarities: NFT['rarity'][] = ['common', 'rare', 'epic', 'legendary'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const names = ['Cyber Punk', 'Neon Warrior', 'Digital Ghost', 'Quantum Knight', 'Pixel Hunter', 'Chrome Samurai'];
  
  return {
    id,
    name: `${names[Math.floor(Math.random() * names.length)]} #${Math.floor(Math.random() * 9999)}`,
    rarity,
    image: `https://picsum.photos/seed/${id}/200/200`,
    price: ownerId === 'global' ? Math.floor(Math.random() * 100) + 20 : undefined,
    forSale: ownerId === 'global',
    ownerId,
  };
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState(0);
  const [igc, setIgc] = useState(100);
  const [stakedIgc, setStakedIgc] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastDailyReward, setLastDailyReward] = useState<Date | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [globalNfts] = useState<NFT[]>(() => 
    Array.from({ length: 8 }, (_, i) => generateRandomNft(`global-${i}`, 'global'))
  );
  const [missions, setMissions] = useState<Mission[]>(initialMissions);

  const miningBoost = stakedIgc > 0 ? Math.floor(stakedIgc / 100) + 1 : 1;
  const canClaimDaily = !lastDailyReward || 
    new Date().getTime() - lastDailyReward.getTime() > 24 * 60 * 60 * 1000;

  const playSound = useCallback((type: 'mine' | 'coin' | 'win' | 'lose' | 'click') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'mine':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'coin':
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
      case 'win':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
      case 'lose':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'click':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
    }
  }, []);

  const addTransaction = useCallback((
    type: Transaction['type'],
    amount: number,
    currency: Transaction['currency'],
    description: string
  ) => {
    setTransactions(prev => [{
      id: Date.now().toString(),
      type,
      amount,
      currency,
      timestamp: new Date(),
      description,
    }, ...prev].slice(0, 50));
  }, []);

  const checkAchievements = useCallback(() => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      let progress = 0;
      switch (achievement.type) {
        case 'mining':
          progress = totalMined;
          break;
        case 'games':
          progress = gamesWon;
          break;
        case 'staking':
          progress = stakedIgc;
          break;
      }
      
      if (progress >= achievement.requirement) {
        return { ...achievement, unlocked: true };
      }
      return achievement;
    }));
  }, [totalMined, gamesWon, stakedIgc]);

  const mine = useCallback(() => {
    const gained = 10 * miningBoost;
    setResources(prev => prev + gained);
    setTotalMined(prev => prev + gained);
    playSound('mine');
    addTransaction('mine', gained, 'resources', `Mined ${gained} resources (${miningBoost}x boost)`);
    
    setMissions(prev => prev.map(m => 
      m.id === 'd1' || m.id === 'w1' 
        ? { ...m, progress: Math.min(m.progress + gained, m.target), completed: m.progress + gained >= m.target }
        : m
    ));
    
    setTimeout(checkAchievements, 100);
  }, [miningBoost, playSound, addTransaction, checkAchievements]);

  const exchangeResources = useCallback(() => {
    if (resources < 100) return false;
    setResources(prev => prev - 100);
    setIgc(prev => prev + 1);
    playSound('coin');
    addTransaction('exchange', 1, 'igc', 'Exchanged 100 resources for 1 IGC');
    
    setMissions(prev => prev.map(m => 
      m.id === 'd3' 
        ? { ...m, progress: Math.min(m.progress + 1, m.target), completed: m.progress + 1 >= m.target }
        : m
    ));
    
    return true;
  }, [resources, playSound, addTransaction]);

  const stakeIgc = useCallback((amount: number) => {
    if (igc < amount || amount <= 0) return false;
    setIgc(prev => prev - amount);
    setStakedIgc(prev => prev + amount);
    playSound('click');
    addTransaction('stake', amount, 'igc', `Staked ${amount} IGC`);
    setTimeout(checkAchievements, 100);
    return true;
  }, [igc, playSound, addTransaction, checkAchievements]);

  const unstakeIgc = useCallback(() => {
    if (stakedIgc <= 0) return;
    const amount = stakedIgc;
    setStakedIgc(0);
    setIgc(prev => prev + amount);
    playSound('coin');
    addTransaction('unstake', amount, 'igc', `Unstaked ${amount} IGC`);
  }, [stakedIgc, playSound, addTransaction]);

  const claimDailyReward = useCallback((day: number) => {
    const rewards = [10, 20, 30, 40, 50, 75, 200];
    const reward = rewards[day - 1] || 10;
    setIgc(prev => prev + reward);
    setDailyStreak(day);
    setLastDailyReward(new Date());
    playSound('win');
    addTransaction('claim', reward, 'igc', `Day ${day} daily reward`);
  }, [playSound, addTransaction]);

  const addIgc = useCallback((amount: number, description: string) => {
    setIgc(prev => prev + amount);
    setGamesPlayed(prev => prev + 1);
    setGamesWon(prev => prev + 1);
    playSound('win');
    addTransaction('win', amount, 'igc', description);
    
    setMissions(prev => prev.map(m => {
      if (m.id === 'd2') return { ...m, progress: Math.min(m.progress + 1, m.target), completed: m.progress + 1 >= m.target };
      if (m.id === 'w2') return { ...m, progress: Math.min(m.progress + 1, m.target), completed: m.progress + 1 >= m.target };
      return m;
    }));
    
    setTimeout(checkAchievements, 100);
  }, [playSound, addTransaction, checkAchievements]);

  const removeIgc = useCallback((amount: number, description: string) => {
    if (igc < amount) return false;
    setIgc(prev => prev - amount);
    setGamesPlayed(prev => prev + 1);
    playSound('lose');
    addTransaction('loss', amount, 'igc', description);
    
    setMissions(prev => prev.map(m => 
      m.id === 'd2' 
        ? { ...m, progress: Math.min(m.progress + 1, m.target), completed: m.progress + 1 >= m.target }
        : m
    ));
    
    return true;
  }, [igc, playSound, addTransaction]);

  const mintNft = useCallback(() => {
    if (igc < 50) return false;
    setIgc(prev => prev - 50);
    const newNft = generateRandomNft(`nft-${Date.now()}`, 'player');
    newNft.forSale = false;
    setNfts(prev => [...prev, newNft]);
    playSound('win');
    addTransaction('mint', 50, 'igc', `Minted ${newNft.name}`);
    
    setMissions(prev => prev.map(m => 
      m.id === 'w3' 
        ? { ...m, progress: Math.min(m.progress + 1, m.target), completed: m.progress + 1 >= m.target }
        : m
    ));
    
    return true;
  }, [igc, playSound, addTransaction]);

  const listNftForSale = useCallback((nftId: string, price: number) => {
    setNfts(prev => prev.map(nft => 
      nft.id === nftId ? { ...nft, forSale: true, price } : nft
    ));
    playSound('click');
  }, [playSound]);

  const buyNft = useCallback((nftId: string) => {
    const nft = globalNfts.find(n => n.id === nftId);
    if (!nft || !nft.price || igc < nft.price) return false;
    
    setIgc(prev => prev - nft.price!);
    const boughtNft = { ...nft, forSale: false, ownerId: 'player', price: undefined };
    setNfts(prev => [...prev, boughtNft]);
    playSound('coin');
    addTransaction('buy', nft.price, 'igc', `Bought ${nft.name}`);
    return true;
  }, [globalNfts, igc, playSound, addTransaction]);

  const updateMissionProgress = useCallback((missionId: string, progress: number) => {
    setMissions(prev => prev.map(m => 
      m.id === missionId 
        ? { ...m, progress: Math.min(progress, m.target), completed: progress >= m.target }
        : m
    ));
  }, []);

  const claimMissionReward = useCallback((missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;
    
    if (mission.rewardType === 'igc') {
      setIgc(prev => prev + mission.reward);
    } else {
      setResources(prev => prev + mission.reward);
    }
    
    setMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, claimed: true } : m
    ));
    
    playSound('win');
    addTransaction('claim', mission.reward, mission.rewardType === 'igc' ? 'igc' : 'resources', `Claimed ${mission.title} reward`);
  }, [missions, playSound, addTransaction]);

  return (
    <GameContext.Provider value={{
      resources,
      igc,
      stakedIgc,
      miningBoost,
      totalMined,
      gamesPlayed,
      gamesWon,
      dailyStreak,
      lastDailyReward,
      canClaimDaily,
      achievements,
      transactions,
      nfts,
      globalNfts,
      missions,
      mine,
      exchangeResources,
      stakeIgc,
      unstakeIgc,
      claimDailyReward,
      addIgc,
      removeIgc,
      mintNft,
      listNftForSale,
      buyNft,
      updateMissionProgress,
      claimMissionReward,
      playSound,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
