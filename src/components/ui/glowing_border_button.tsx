'use client'

import React from 'react';

interface CustomButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  width?: string;
  height?: string;
  // ...other props if needed
}

const GlowingBorderButton: React.FC<CustomButtonProps> = ({
  children = 'How can Bolt help you today?',
  onClick,
  width = '400px',
  height = '100px',
  // ...other props
}) => {
  return (
    <button
      onClick={onClick}
      style={{ width, height, boxShadow: `
        inset 0 0 0 1px #333333,
        inset 2px 1.5px 0 0 #4a90e2
      `,
      clipPath: 'inset(0 0 0 0 round 12px)' }}
      className="relative bg-[#1c1c1c] text-gray-400 rounded-xl font-medium transition-all duration-300 hover:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <span className="relative z-10 text-xl p-6 block text-left">{children}</span>
    </button>
  );
};

export default GlowingBorderButton;
