import React from 'react';
import { RotatingCard } from '../PlayingCards';

export default function PlayingCardDecoration() {
  const cards = [
    { suit: '♠', value: 'A', left: '5%', top: '20%' },
    { suit: '♥', value: 'K', left: '90%', top: '30%' },
    { suit: '♦', value: 'Q', left: '8%', top: '70%' },
    { suit: '♣', value: 'J', left: '92%', top: '65%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
      {cards.map((card, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: card.left, top: card.top }}
        >
          <RotatingCard suit={card.suit} value={card.value} autoRotate={true} />
        </div>
      ))}
    </div>
  );
}