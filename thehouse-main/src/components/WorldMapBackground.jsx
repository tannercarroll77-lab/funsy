import React from 'react';

export default function WorldMapBackground() {
  // Major trading hubs coordinates (scaled for SVG viewBox)
  const nodes = [
    { x: 180, y: 140, name: 'New York' },
    { x: 250, y: 130, name: 'London' },
    { x: 320, y: 160, name: 'Dubai' },
    { x: 380, y: 150, name: 'Hong Kong' },
    { x: 400, y: 140, name: 'Tokyo' },
    { x: 420, y: 180, name: 'Singapore' },
    { x: 150, y: 220, name: 'São Paulo' },
    { x: 280, y: 190, name: 'Johannesburg' },
  ];

  return (
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 600 300"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Simplified world map outline */}
        <path
          d="M 50 100 Q 100 80 150 90 T 250 100 Q 300 90 350 110 T 450 100 Q 500 110 550 100 M 80 150 Q 120 140 160 145 T 240 150 Q 280 155 320 150 T 420 155 Q 460 150 500 160 M 100 200 Q 140 190 180 195 T 260 200 Q 300 205 340 200 T 440 205 Q 480 200 520 210"
          stroke="#00e5ff"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
        
        {/* Grid lines */}
        {[...Array(6)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={50 + i * 40}
            x2="600"
            y2={50 + i * 40}
            stroke="#00e5ff"
            strokeWidth="0.3"
            opacity="0.3"
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={60 + i * 60}
            y1="0"
            x2={60 + i * 60}
            y2="300"
            stroke="#00e5ff"
            strokeWidth="0.3"
            opacity="0.3"
          />
        ))}

        {/* Pulsing nodes */}
        {nodes.map((node, index) => (
          <g key={index}>
            {/* Outer pulse ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="1"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values="8;16;8"
                dur="3s"
                repeatCount="indefinite"
                begin={`${index * 0.3}s`}
              />
              <animate
                attributeName="opacity"
                values="0.4;0;0.4"
                dur="3s"
                repeatCount="indefinite"
                begin={`${index * 0.3}s`}
              />
            </circle>
            
            {/* Core node */}
            <circle
              cx={node.x}
              cy={node.y}
              r="3"
              fill="#00e5ff"
              opacity="0.8"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="2s"
                repeatCount="indefinite"
                begin={`${index * 0.2}s`}
              />
            </circle>

            {/* Connection lines */}
            {index < nodes.length - 1 && (
              <line
                x1={node.x}
                y1={node.y}
                x2={nodes[index + 1].x}
                y2={nodes[index + 1].y}
                stroke="#00e5ff"
                strokeWidth="0.5"
                opacity="0.2"
                strokeDasharray="2,2"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}