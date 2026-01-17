import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Menu, 
  X, 
  LayoutDashboard, 
  Gamepad2, 
  Store, 
  User,
  Target,
  Loader2,
  Zap
} from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MissionsModal from './MissionsModal';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/profile', label: 'Profile', icon: User },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const { address, balance, isConnected, isSimulation, isConnecting, connectWallet, disconnectWallet } = useWeb3();
  const { igc, resources } = useGame();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold gradient-text hidden sm:block">CyberCoin</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}>
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === to
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </motion.div>
                </Link>
              ))}
              
              <motion.button
                onClick={() => setMissionsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Target className="w-4 h-4" />
                <span className="font-medium">Missions</span>
              </motion.button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Currency Display */}
              {isConnected && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                    <span className="text-primary">⚡</span>
                    <span className="font-medium">{resources.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                    <span className="text-secondary">💎</span>
                    <span className="font-medium">{igc.toLocaleString()} IGC</span>
                  </div>
                </div>
              )}

              {/* Wallet Button */}
              {isConnected ? (
                <motion.button
                  onClick={disconnectWallet}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:border-primary/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wallet className="w-4 h-4 text-primary" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {isSimulation && <span className="text-yellow-500">SIM</span>}
                      <span>{balance} ETH</span>
                    </div>
                    <div className="text-sm font-medium">{address}</div>
                  </div>
                </motion.button>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="cyber-button text-white"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="glass-card border-l border-border/50 w-72">
                  <div className="flex flex-col gap-4 mt-8">
                    {/* Mobile Currency */}
                    {isConnected && (
                      <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Resources</span>
                          <span className="font-medium">⚡ {resources.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">IGC</span>
                          <span className="font-medium">💎 {igc.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {/* Mobile Nav Links */}
                    {navLinks.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          location.pathname === to
                            ? 'bg-primary/20 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setMissionsOpen(true);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Target className="w-5 h-5" />
                      <span className="font-medium">Missions</span>
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <MissionsModal open={missionsOpen} onOpenChange={setMissionsOpen} />
    </>
  );
};

export default Navbar;
