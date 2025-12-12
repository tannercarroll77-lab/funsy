import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCard({ children, className = '', delay = 0 }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x: x * 0.05, y: y * 0.05 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
        transition: 'transform 0.2s ease-out',
      }}
      className={`relative ${className}`}
    >
      {/* Animated border gradient */}
      <div 
        className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.5), rgba(127, 29, 29, 0.5), rgba(220, 38, 38, 0.5))',
          backgroundSize: '200% 100%',
          animation: isHovered ? 'borderSweep 3s linear infinite' : 'none',
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      
      {/* Inner glow on hover */}
      <div 
        className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          boxShadow: 'inset 0 0 20px rgba(220, 38, 38, 0.2), inset 0 0 40px rgba(127, 29, 29, 0.1)',
        }}
      />

      {children}
    </motion.div>
  );
}