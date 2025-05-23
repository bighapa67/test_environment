import React from 'react';

interface GradientBorderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const GlowingBorderButton4: React.FC<GradientBorderButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="relative px-8 py-4 bg-[#1E1E1E] text-gray-500 rounded-lg overflow-hidden group"
      onClick={onClick}
    >
      <span className="relative z-10 group-hover:text-gray-300 transition-colors duration-300">
        {children}
      </span>
      <div className="absolute inset-0">
        <div className="absolute inset-0 rounded-lg bg-[#1E1E1E]"></div>
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute -inset-[1px] bg-gradient-to-tl 
            from-transparent via-transparent to-[#3B82F6] 
            group-hover:opacity-100 transition-opacity duration-300 ease-in-out group-hover:animate-pulse"></div>
        </div>
        <div className="absolute inset-[1px] rounded-lg bg-[#1E1E1E]"></div>
      </div>
    </button>
  );
};

export default GlowingBorderButton4;
