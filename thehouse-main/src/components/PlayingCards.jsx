import React, { useState, useEffect } from 'react';

export default function PlayingCards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Generate random playing cards
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', 'K', 'Q', 'J', '10'];
    const colors = ['text-white', 'text-[#dc2626]', 'text-[#dc2626]', 'text-white'];
    
    const newCards = Array(6).fill(0).map((_, i) => ({
      suit: suits[i % 4],
      value: values[Math.floor(Math.random() * values.length)],
      color: colors[i % 4],
      rotation: Math.random() * 30 - 15,
      delay: i * 0.2
    }));
    
    setCards(newCards);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {cards.map((card, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * 15}%`,
            top: '50%',
            animation: `floatCard ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${card.delay}s`,
            transform: `rotate(${card.rotation}deg)`
          }}
        >
          <div className="w-20 h-28 bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center border-2 border-gray-300">
            <div className={`text-4xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <div className={`text-5xl ${card.color}`}>
              {card.suit}
            </div>
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes floatCard {
          0%, 100% { 
            transform: translateY(0px) rotate(${Math.random() * 30 - 15}deg); 
          }
          50% { 
            transform: translateY(-40px) rotate(${Math.random() * 30 - 15}deg); 
          }
        }
      `}</style>
    </div>
  );
}

export function PlayingCardStack({ cards = ['♠A', '♥K', '♦Q', '♣J'] }) {
  return (
    <div className="relative w-32 h-40">
      {cards.map((card, i) => {
        const suit = card.slice(-1);
        const value = card.slice(0, -1);
        const isRed = suit === '♥' || suit === '♦';
        
        return (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-300 hover:scale-110 hover:z-10"
            style={{
              transform: `rotate(${i * 3 - 6}deg) translateX(${i * 4}px)`,
              zIndex: i
            }}
          >
            <div className="w-full h-full bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center border-2 border-gray-200 cursor-pointer hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]">
              <div className={`text-3xl font-bold ${isRed ? 'text-[#dc2626]' : 'text-black'}`}>
                {value}
              </div>
              <div className={`text-4xl ${isRed ? 'text-[#dc2626]' : 'text-black'}`}>
                {suit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RotatingCard({ suit = '♠', value = 'A', autoRotate = true }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const isRed = suit === '♥' || suit === '♦';

  React.useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setIsFlipped(prev => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  return (
    <div 
      className="w-24 h-32 cursor-pointer perspective-1000"
      onClick={() => !autoRotate && setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-white rounded-xl shadow-xl flex flex-col items-center justify-center border-2 border-gray-200">
            <div className={`text-3xl font-bold ${isRed ? 'text-[#dc2626]' : 'text-black'}`}>
              {value}
            </div>
            <div className={`text-4xl ${isRed ? 'text-[#dc2626]' : 'text-black'}`}>
              {suit}
            </div>
          </div>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-[#dc2626] to-[#fbbf24] rounded-xl shadow-xl flex items-center justify-center border-2 border-[#fbbf24]">
            <div className="text-6xl font-bold text-white opacity-50">♠</div>
          </div>
        </div>
      </div>
    </div>
  );
}