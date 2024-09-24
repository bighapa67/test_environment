"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Mock data with more variation, including dips below 8,000
const data = [
  { time: '12AM', price: 5000 },
  { time: '1AM', price: 10000 },
  { time: '2AM', price: 8000 },
  { time: '3AM', price: 17500 },
  { time: '4AM', price: 15000 },
  { time: '5AM', price: 12000 },
  { time: '6AM', price: 20000 },
  { time: '7AM', price: 10000 },
  { time: '8AM', price: 8500 },
  { time: '9AM', price: 12000 },
  { time: '10AM', price: 16000 },
  { time: '11AM', price: 12000 },
  { time: '12PM', price: 14000 },
  { time: '1PM', price: 10000 },
  { time: '2PM', price: 15500 },
  { time: '3PM', price: 22000 },
  { time: '4PM', price: 19000 },
  { time: '5PM', price: 25000 },
]

export function GradientChart() {
  return (
    <div className="w-full p-4 bg-gray-900 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-5xl bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-3xl font-bold text-center text-blue-400 tracking-wider">
            Gradient Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[500px] w-full"> {/* Changed from h-[300px] to h-[500px] */}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  stroke="#4A5568" 
                  horizontal={true} 
                  vertical={false} 
                  strokeWidth={0.5}  // Added this line to make the gridlines thinner
                />
                <XAxis dataKey="time" stroke="#718096" />
                <YAxis 
                  dataKey="price"
                  stroke="#718096" 
                  domain={['dataMin - 2000', 'dataMax + 2000']} 
                  tickCount={10}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#A0AEC0' }}
                  labelStyle={{ color: '#E2E8F0' }}
                />
                <Area 
                  type="linear"
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