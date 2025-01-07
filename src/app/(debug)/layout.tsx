'use client'

interface DebugLayoutProps {
  children: React.ReactNode;
}

export default function DebugLayout({ children }: DebugLayoutProps) {
  return (
    <div className="relative">
      {/* Debug mode indicator */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black text-xs px-2 py-1 text-center z-50">
        🐛 Debug Mode
      </div>
      {/* Add padding to account for debug indicator */}
      <div className="pt-6">
        {children}
      </div>
    </div>
  );
} 