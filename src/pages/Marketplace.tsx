import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Sparkles, ShoppingCart, Tag } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-orange-600',
};

const rarityGlow = {
  common: '',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/30',
  legendary: 'shadow-yellow-500/50 animate-pulse',
};

const Marketplace: React.FC = () => {
  const { isConnected } = useWeb3();
  const { igc, nfts, globalNfts, mintNft, listNftForSale, buyNft } = useGame();
  const [listPrice, setListPrice] = useState<{ [key: string]: string }>({});

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Store className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 gradient-text">Connect to Trade</h2>
          <p className="text-muted-foreground">
            Connect your wallet to access the NFT marketplace.
          </p>
        </motion.div>
      </div>
    );
  }

  const handleMint = () => {
    mintNft();
  };

  const handleList = (nftId: string) => {
    const price = parseInt(listPrice[nftId]);
    if (price > 0) {
      listNftForSale(nftId, price);
      setListPrice(prev => ({ ...prev, [nftId]: '' }));
    }
  };

  const handleBuy = (nftId: string) => {
    buyNft(nftId);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">NFT Marketplace</h1>
          <p className="text-muted-foreground">Mint, trade, and collect unique NFT badges</p>
        </motion.div>

        <Tabs defaultValue="mint" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
            <TabsTrigger value="mint" className="data-[state=active]:bg-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Mint
            </TabsTrigger>
            <TabsTrigger value="my-nfts" className="data-[state=active]:bg-primary/20">
              <Tag className="w-4 h-4 mr-2" />
              My NFTs
            </TabsTrigger>
            <TabsTrigger value="browse" className="data-[state=active]:bg-primary/20">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse
            </TabsTrigger>
          </TabsList>

          {/* Mint Tab */}
          <TabsContent value="mint">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center max-w-md mx-auto"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Mint a Random NFT</h3>
              <p className="text-muted-foreground mb-6">
                Get a random NFT badge with varying rarities!
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {Object.entries(rarityColors).map(([rarity, gradient]) => (
                  <span
                    key={rarity}
                    className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white capitalize`}
                  >
                    {rarity}
                  </span>
                ))}
              </div>

              <Button
                onClick={handleMint}
                disabled={igc < 50}
                className="cyber-button text-white px-8"
              >
                Mint NFT (50 IGC)
              </Button>
              <p className="text-sm text-muted-foreground mt-4">Balance: {igc} IGC</p>
            </motion.div>
          </TabsContent>

          {/* My NFTs Tab */}
          <TabsContent value="my-nfts">
            {nfts.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">You don't have any NFTs yet. Mint one to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {nfts.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card-hover overflow-hidden shadow-lg ${rarityGlow[nft.rarity]}`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${rarityColors[nft.rarity]}`} />
                    <div className="p-4">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full aspect-square object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-bold truncate">{nft.name}</h4>
                      <span className={`text-xs font-medium capitalize bg-gradient-to-r ${rarityColors[nft.rarity]} bg-clip-text text-transparent`}>
                        {nft.rarity}
                      </span>
                      
                      {nft.forSale ? (
                        <div className="mt-3 p-2 rounded bg-green-500/10 text-center">
                          <p className="text-sm text-green-500 font-medium">Listed for {nft.price} IGC</p>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <Input
                            type="number"
                            placeholder="Price"
                            value={listPrice[nft.id] || ''}
                            onChange={(e) => setListPrice(prev => ({ ...prev, [nft.id]: e.target.value }))}
                            className="flex-1 bg-muted/30 h-8 text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleList(nft.id)}
                            disabled={!listPrice[nft.id] || parseInt(listPrice[nft.id]) <= 0}
                            className="text-xs"
                          >
                            List
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Browse Tab */}
          <TabsContent value="browse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {globalNfts.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card-hover overflow-hidden shadow-lg ${rarityGlow[nft.rarity]}`}
                >
                  <div className={`h-2 bg-gradient-to-r ${rarityColors[nft.rarity]}`} />
                  <div className="p-4">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full aspect-square object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-bold truncate">{nft.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-medium capitalize bg-gradient-to-r ${rarityColors[nft.rarity]} bg-clip-text text-transparent`}>
                        {nft.rarity}
                      </span>
                      <span className="text-sm font-bold text-primary">{nft.price} IGC</span>
                    </div>
                    
                    <Button
                      className="w-full mt-3 cyber-button text-white text-sm"
                      onClick={() => handleBuy(nft.id)}
                      disabled={igc < (nft.price || 0)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketplace;
