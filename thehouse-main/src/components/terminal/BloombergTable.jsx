import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function BloombergTable({ data, columns }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [editingCell, setEditingCell] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#dc2626]/20">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left p-3 text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`border-b border-white/5 transition-all duration-200 ${
                rowIndex % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
              } ${
                hoveredRow === rowIndex
                  ? 'bg-[#dc2626]/10 shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                  : ''
              }`}
            >
              {columns.map((col, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isEditing = editingCell === cellKey;
                const value = row[col.key];
                
                return (
                  <td
                    key={colIndex}
                    className="p-3 relative"
                    onClick={() => col.editable && setEditingCell(cellKey)}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={value}
                        autoFocus
                        onBlur={() => setEditingCell(null)}
                        className="w-full bg-[#dc2626]/20 border-2 border-[#dc2626] rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                      />
                    ) : (
                      <span
                        className={`${
                          col.editable ? 'cursor-pointer hover:text-[#dc2626]' : ''
                        } ${
                          col.highlight === 'green' && value > 0
                            ? 'text-green-400 font-semibold'
                            : col.highlight === 'red' && value < 0
                            ? 'text-red-400 font-semibold'
                            : 'text-white'
                        }`}
                      >
                        {col.format ? col.format(value) : value}
                        {col.showTrend && (
                          <span className="ml-2 inline-block">
                            {value > 0 ? (
                              <TrendingUp className="w-3 h-3 text-green-400 inline" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-400 inline" />
                            )}
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}