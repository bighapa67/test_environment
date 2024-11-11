'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const AiderPage: React.FC = () => {
  const [isDarkGray, setIsDarkGray] = useState(true)

  const toggleBackground = () => {
    setIsDarkGray(!isDarkGray)
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        isDarkGray
          ? 'bg-gradient-to-r from-gray-800 to-gray-900'
          : 'bg-gradient-to-r from-orange-200 to-orange-300'
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">Aider Architect: LOCALLY-ish!!!</h1>
      <Button onClick={toggleBackground} variant="outline">
        Toggle Background
      </Button>
    </div>
  )
}

export default AiderPage
