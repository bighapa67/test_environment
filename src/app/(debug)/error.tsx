'use client'

import { useEffect } from 'react'
import { serverLogger } from '@/app/utils/server-logger'

export default function DebugError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    serverLogger.error('Debug route error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-red-50 p-8">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Debug Mode Error
        </h2>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <pre className="text-sm text-red-600 whitespace-pre-wrap">
            {error.message}
          </pre>
          {error.stack && (
            <pre className="mt-4 text-xs text-gray-600 whitespace-pre-wrap">
              {error.stack}
            </pre>
          )}
        </div>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 