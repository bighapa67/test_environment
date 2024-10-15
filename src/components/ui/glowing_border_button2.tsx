import React from 'react'

interface CustomButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  width?: string
  height?: string
}

export function GlowingBorderButton2({ 
  children = 'How can Bolt help you today?', 
  onClick, 
  width = '400px', 
  height = '100px' 
}: CustomButtonProps) {
  return (
    <button
      className="relative bg-[#1c1c1c] text-gray-400 rounded-xl font-medium transition-all duration-300 hover:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      onClick={onClick}
      style={{ 
        width, 
        height,
        boxShadow: 'inset 0 0 0 1px #333333',
      }}
    >
      <span className="relative z-10 text-xl p-6 block text-left">{children}</span>
      <span 
        // className="absolute top-0 left-0 bg-transparent"
        className="absolute top-0 left-0 bg-[#1c1c1c]"
        style={{
          width: '33%',
          height: '50%',
          boxShadow: 'inset 2px 1.5px 0 0 #4a90e2',
          borderRadius: '12px 0 0 0',
        }}
      />
    </button>
  )
}
