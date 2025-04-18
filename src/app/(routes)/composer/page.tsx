'use client';

import { useState } from 'react';
import GlowingBorderButton from "@/components/ui/glowing_border_button";

export default function ComposerPage() {
  const [isBlueTheme, setIsBlueTheme] = useState(false);

  const toggleTheme = () => {
    setIsBlueTheme(!isBlueTheme);
  };

  return (
    <div 
      className={`min-h-screen p-8 flex flex-col items-center justify-center gap-8 ${
        isBlueTheme 
          ? 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300'
          : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
      }`}
    >
      <h1 className={`text-4xl font-bold ${isBlueTheme ? 'text-gray-800' : 'text-white'}`}>
        Cursor Composer whips Aider&apos;s ass!!!
      </h1>
      
      <GlowingBorderButton onClick={toggleTheme}>
        Toggle Theme
      </GlowingBorderButton>
    </div>
  );
} 