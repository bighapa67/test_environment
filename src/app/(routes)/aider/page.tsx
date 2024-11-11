'use client'
import { useState } from 'react';
import GlowingBorderButton from '@/components/ui/glowing_border_button';

const AiderPage = () => {
  const [isBlueBackground, setIsBlueBackground] = useState(false);

  const toggleBackground = () => {
    setIsBlueBackground((prevState) => !prevState);
  };

  const backgroundClass = isBlueBackground
    ? 'bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500'
    : 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-500';

  return (
    <div className={`${backgroundClass} min-h-screen flex flex-col items-center justify-center`}>
      <h1 className="text-3xl font-bold mb-4">I'm using Aider LOCALLY-ish!!!</h1>
      <GlowingBorderButton onClick={toggleBackground}>
        Toggle Background
      </GlowingBorderButton>
    </div>
  );
};

export default AiderPage;
