'use client'

interface CustomButtonProps {
  children: React.ReactNode
  onClick?: () => void
  width?: string
  height?: string
}

export function GlowingBorderButton({ 
  children = 'How can Bolt help you today?', 
  onClick, 
  width = '400px', 
  height = '100px' 
}: CustomButtonProps) {
  return (
    <div className="flex items-center justify-center bg-[#1c1c1c] p-8" style={{ width: '100%', height: '100vh' }}>
      <button
        className="relative bg-[#1c1c1c] text-gray-400 rounded-xl font-medium transition-all duration-300 hover:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={onClick}
        style={{ 
          width, 
          height,
          boxShadow: `
            inset 0 0 0 1px #333333,
            inset 2px 2px 0 0 #4a90e2
          `,
          clipPath: 'inset(0 0 0 0 round 12px)',
        }}
      >
        <span className="relative z-10 text-xl p-6 block text-left">{children}</span>
      </button>
    </div>
  )
}