'use client'

import React, { useState } from 'react'
import GlowingBorderButton from '@/components/ui/glowing_border_button'

const AiderPage: React.FC = () => {
  const [isLightGray, setIsLightGray] = useState(true)

  const toggleBackground = () => {
    setIsLightGray(!isLightGray)
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        isLightGray
          ? 'bg-gradient-to-r from-gray-200 to-gray-300'
          : 'bg-gradient-to-r from-orange-200 to-orange-300'
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">Aider Architect: LOCALLY-ish!!!</h1>
      <GlowingBorderButton onClick={toggleBackground}>
        Toggle Background
      </GlowingBorderButton>
    </div>
  )
}

export default AiderPage
