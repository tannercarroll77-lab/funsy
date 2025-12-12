import React, { useState, useRef } from 'react';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function DraggableWidget({ 
  title, 
  children, 
  defaultPosition = { x: 0, y: 0 },
  onClose 
}) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.widget-content')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <Card
      className={`absolute bg-[#0b0e17]/95 backdrop-blur-2xl border-2 border-[#dc2626]/30 shadow-2xl overflow-hidden transition-all duration-300 ${
        isDragging ? 'cursor-grabbing shadow-[0_0_40px_rgba(220,38,38,0.4)]' : 'cursor-default'
      } ${isMaximized ? 'inset-4' : ''}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? 'calc(100% - 2rem)' : '400px',
        zIndex: isDragging ? 100 : 50
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gradient-to-r from-[#dc2626]/20 to-transparent border-b border-[#dc2626]/20 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-bold text-white">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4 text-gray-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="widget-content p-4 max-h-[600px] overflow-y-auto">
        {children}
      </div>
    </Card>
  );
}