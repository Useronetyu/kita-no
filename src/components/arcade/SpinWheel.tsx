import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

const segments = [
  { label: '5 IGC', value: 5, color: '#a855f7' },
  { label: '10 IGC', value: 10, color: '#3b82f6' },
  { label: '0', value: 0, color: '#6b7280' },
  { label: '20 IGC', value: 20, color: '#10b981' },
  { label: '2 IGC', value: 2, color: '#f59e0b' },
  { label: '50 IGC', value: 50, color: '#ec4899' },
  { label: '0', value: 0, color: '#6b7280' },
  { label: '100 IGC', value: 100, color: '#8b5cf6' },
];

const SpinWheel: React.FC = () => {
  const { igc, addIgc, removeIgc } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinCost = 5;

  const spin = () => {
    if (isSpinning || igc < spinCost) return;
    
    removeIgc(spinCost, 'Spin the Wheel entry fee');
    setIsSpinning(true);
    setResult(null);
    
    // Calculate winning segment
    const winningIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = 360 / segments.length;
    const targetAngle = 360 - (winningIndex * segmentAngle) - (segmentAngle / 2);
    const spins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + (spins * 360) + targetAngle;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      const prize = segments[winningIndex].value;
      setResult(prize);
      setIsSpinning(false);
      if (prize > 0) {
        addIgc(prize, `Won ${prize} IGC on Spin the Wheel`);
      }
    }, 4000);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold gradient-text mb-6 text-center">🎡 Spin the Wheel</h2>
      
      <div className="flex flex-col items-center gap-6">
        {/* Wheel Container */}
        <div className="relative w-72 h-72 md:w-80 md:h-80">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
          </div>
          
          {/* Wheel */}
          <motion.div
            ref={wheelRef}
            className="w-full h-full rounded-full overflow-hidden border-4 border-primary/50 shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {segments.map((segment, index) => {
                const angle = 360 / segments.length;
                const startAngle = index * angle - 90;
                const endAngle = startAngle + angle;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                
                const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
                const textX = 50 + 35 * Math.cos(midAngle);
                const textY = 50 + 35 * Math.sin(midAngle);
                const textRotation = (startAngle + endAngle) / 2 + 90;
                
                return (
                  <g key={index}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={segment.color}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </div>

        {/* Result */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-2xl font-bold ${result > 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {result > 0 ? `🎉 You won ${result} IGC!` : '😢 Better luck next time!'}
          </motion.div>
        )}

        {/* Spin Button */}
        <Button
          onClick={spin}
          disabled={isSpinning || igc < spinCost}
          className="cyber-button text-white px-8 py-4 text-lg"
        >
          {isSpinning ? 'Spinning...' : `Spin (${spinCost} IGC)`}
        </Button>
        
        <p className="text-sm text-muted-foreground">Balance: {igc} IGC</p>
      </div>
    </div>
  );
};

export default SpinWheel;
