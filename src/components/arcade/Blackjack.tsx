import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Card = { suit: string; value: string; numValue: number };

const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  suits.forEach(suit => {
    values.forEach(value => {
      let numValue = parseInt(value) || (value === 'A' ? 11 : 10);
      deck.push({ suit, value, numValue });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const calculateHand = (hand: Card[]): number => {
  let total = hand.reduce((sum, card) => sum + card.numValue, 0);
  let aces = hand.filter(card => card.value === 'A').length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
};

const CardDisplay: React.FC<{ card: Card; hidden?: boolean }> = ({ card, hidden }) => (
  <motion.div
    initial={{ scale: 0, rotateY: 180 }}
    animate={{ scale: 1, rotateY: 0 }}
    className={`w-16 h-24 rounded-lg flex flex-col items-center justify-center font-bold text-lg shadow-lg ${
      hidden 
        ? 'bg-gradient-to-br from-primary to-secondary'
        : 'bg-card border border-border'
    }`}
  >
    {!hidden && (
      <>
        <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : ''}>
          {card.value}
        </span>
        <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : ''}>
          {card.suit}
        </span>
      </>
    )}
  </motion.div>
);

const Blackjack: React.FC = () => {
  const { igc, addIgc, removeIgc } = useGame();
  const [bet, setBet] = useState('10');
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'finished'>('betting');
  const [result, setResult] = useState<string | null>(null);
  const [showDealer, setShowDealer] = useState(false);

  const startGame = () => {
    const betAmount = parseInt(bet);
    if (betAmount <= 0 || betAmount > igc) return;
    
    removeIgc(betAmount, 'Blackjack bet');
    
    const newDeck = createDeck();
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('playing');
    setResult(null);
    setShowDealer(false);
    
    if (calculateHand(pHand) === 21) {
      endGame(pHand, dHand, newDeck, true);
    }
  };

  const hit = () => {
    const newCard = deck.pop()!;
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck([...deck]);
    
    if (calculateHand(newHand) > 21) {
      endGame(newHand, dealerHand, deck, false);
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
    setShowDealer(true);
    dealerPlay();
  };

  const dealerPlay = () => {
    let dHand = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHand(dHand) < 17) {
      dHand.push(currentDeck.pop()!);
    }
    
    setDealerHand(dHand);
    setDeck(currentDeck);
    endGame(playerHand, dHand, currentDeck, false);
  };

  const endGame = (pHand: Card[], dHand: Card[], currentDeck: Card[], isBlackjack: boolean) => {
    setShowDealer(true);
    setGameState('finished');
    
    const pScore = calculateHand(pHand);
    const dScore = calculateHand(dHand);
    const betAmount = parseInt(bet);
    
    if (pScore > 21) {
      setResult('Bust! You lose.');
    } else if (isBlackjack && pScore === 21 && pHand.length === 2) {
      addIgc(Math.floor(betAmount * 2.5), 'Blackjack! 2.5x payout');
      setResult('BLACKJACK! 2.5x Win!');
    } else if (dScore > 21) {
      addIgc(betAmount * 2, 'Dealer bust - Blackjack win');
      setResult('Dealer busts! You win!');
    } else if (pScore > dScore) {
      addIgc(betAmount * 2, 'Blackjack win');
      setResult('You win!');
    } else if (pScore < dScore) {
      setResult('Dealer wins.');
    } else {
      addIgc(betAmount, 'Blackjack push');
      setResult('Push - Bet returned.');
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setResult(null);
    setShowDealer(false);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold gradient-text mb-6 text-center">🃏 Blackjack</h2>
      
      {gameState === 'betting' ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="w-32 bg-muted/30"
              min="1"
              max={igc}
            />
            <span className="text-muted-foreground">IGC</span>
          </div>
          <Button
            onClick={startGame}
            disabled={parseInt(bet) <= 0 || parseInt(bet) > igc}
            className="cyber-button text-white"
          >
            Deal Cards
          </Button>
          <p className="text-sm text-muted-foreground">Balance: {igc} IGC</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dealer Hand */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Dealer {showDealer && `(${calculateHand(dealerHand)})`}
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {dealerHand.map((card, i) => (
                <CardDisplay key={i} card={card} hidden={i === 1 && !showDealer} />
              ))}
            </div>
          </div>

          {/* Player Hand */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Your Hand ({calculateHand(playerHand)})
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {playerHand.map((card, i) => (
                <CardDisplay key={i} card={card} />
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-xl font-bold text-center ${
                result.includes('win') || result.includes('BLACKJACK') 
                  ? 'text-green-500' 
                  : result.includes('Push') 
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {result}
            </motion.p>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-3">
            {gameState === 'playing' && (
              <>
                <Button onClick={hit} className="cyber-button text-white">Hit</Button>
                <Button onClick={stand} variant="outline">Stand</Button>
              </>
            )}
            {gameState === 'finished' && (
              <Button onClick={resetGame} className="cyber-button text-white">
                Play Again
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blackjack;
