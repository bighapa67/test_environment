"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format } from 'date-fns';

// Mock data with more variation, including dips below 8,000
const data = [
  { date: '2024-01-01', price: 5000 },
  { date: '2024-01-02', price: 10000 },
  { date: '2024-01-03', price: 8000 },
  { date: '2024-01-04', price: 17500 },
  { date: '2024-01-05', price: 15000 },
  { date: '2024-01-06', price: 12000 },
  { date: '2024-01-07', price: 20000 },
  { date: '2024-01-08', price: 10000 },
  { date: '2024-01-09', price: 8500 },
  { date: '2024-01-10', price: 12000 },
  { date: '2024-01-11', price: 16000 },
  { date: '2024-01-12', price: 12000 },
  { date: '2024-01-13', price: 14000 },
  { date: '2024-01-14', price: 10000 },
  { date: '2024-01-15', price: 15500 },
  { date: '2024-01-16', price: 22000 },
  { date: '2024-01-17', price: 19000 },
  { date: '2024-01-18', price: 25000 },
]

// const data = [
//   { time: '12AM', price: 5000 },
//   { time: '1AM', price: 10000 },
//   { time: '2AM', price: 8000 },
//   { time: '3AM', price: 17500 },
//   { time: '4AM', price: 15000 },
//   { time: '5AM', price: 12000 },
//   { time: '6AM', price: 20000 },
//   { time: '7AM', price: 10000 },
//   { time: '8AM', price: 8500 },
//   { time: '9AM', price: 12000 },
//   { time: '10AM', price: 16000 },
//   { time: '11AM', price: 12000 },
//   { time: '12PM', price: 14000 },
//   { time: '1PM', price: 10000 },
//   { time: '2PM', price: 15500 },
//   { time: '3PM', price: 22000 },
//   { time: '4PM', price: 19000 },
//   { time: '5PM', price: 25000 },
// ]

export function GradientChart() {
  return (
    <div className="w-full p-4 bg-gray-900 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-5xl bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-700 py-3">
          <CardTitle className="text-xl font-bold text-center text-blue-400 tracking-wider">
            Gradient Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[550px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5}}>
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
                  strokeWidth={0.5}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#718096"
                  tickFormatter={(value) => format(new Date(value), 'yyyy-MM-dd')}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickMargin={5}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="price"
                  stroke="#718096" 
                  domain={['dataMin - 2000', 'dataMax + 2000']} 
                  tickCount={10}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fontSize: 14 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#A0AEC0' }}
                  labelStyle={{ color: '#E2E8F0' }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, 'Price']}
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