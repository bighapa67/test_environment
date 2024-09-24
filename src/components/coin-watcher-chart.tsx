"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data with more variation, including dips below 8,000
const data = [
  { time: '12AM', price: 21000 },
  { time: '1AM', price: 20500 },
  { time: '2AM', price: 19000 },
  { time: '3AM', price: 17500 },
  { time: '4AM', price: 15000 },
  { time: '5AM', price: 12000 },
  { time: '6AM', price: 9000 },
  { time: '7AM', price: 7500 },
  { time: '8AM', price: 8500 },
  { time: '9AM', price: 12000 },
  { time: '10AM', price: 16000 },
  { time: '11AM', price: 8000 },
  { time: '12PM', price: 5500 },
  { time: '1PM', price: 10000 },
  { time: '2PM', price: 15500 },
  { time: '3PM', price: 22000 },
  { time: '4PM', price: 19000 },
  { time: '5PM', price: 10500 },
]

export function CoinWatcherChart() {
  return (
    <div className="w-full p-4 bg-gray-900 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-5xl bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-3xl font-bold text-center text-blue-400 tracking-wider">
            CoinWatcher
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#718096" />
                <YAxis stroke="#718096" domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#A0AEC0' }}
                  labelStyle={{ color: '#E2E8F0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            {['24h', '7d', '1m', '1y'].map((period) => (
              <button 
                key={period}
                className="px-4 py-2 text-sm bg-gray-700 text-blue-300 rounded-full transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {period}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}