'use client'

import { useState } from 'react'
import { DataGrid, LayerData } from '@/app/components/DataGrid'

const DummyCard = ({ title }: { title: string }) => (
  <div className="p-6 mb-4 bg-white rounded-lg shadow-sm border">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
  </div>
)

const defaultData: LayerData[] = [
  { layer: 1, spread: "0.50", max_waves: 5, filled_waves: 5 },
  { layer: 2, spread: "0.75", max_waves: 5, filled_waves: 2 },
  { layer: 3, spread: "1.00", max_waves: 5, filled_waves: 0 },
  { layer: 4, spread: "1.25", max_waves: 5, filled_waves: 0 },
  { layer: 5, spread: "1.50", max_waves: 5, filled_waves: 0 },
  { layer: 6, spread: "1.75", max_waves: 5, filled_waves: 0 },
  { layer: 7, spread: "2.00", max_waves: 5, filled_waves: 0 },
  { layer: 8, spread: "2.25", max_waves: 5, filled_waves: 0 },
  { layer: 9, spread: "2.50", max_waves: 5, filled_waves: 0 },
  { layer: 10, spread: "2.75", max_waves: 5, filled_waves: 0 },
];

const Example = () => {
  const [gridData, setGridData] = useState<LayerData[]>(defaultData);

  const handleChange = (data: LayerData[]) => {
    console.log('Parent: handleChange called with length:', data.length);
    console.log('Parent: current gridData length:', gridData.length);
    setGridData(data);
  }

  console.log('Parent: rendering with gridData length:', gridData.length);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Left column with cards */}
          <div className="w-2/3 space-y-4">
            <DummyCard title="Overview" />
            <DummyCard title="Statistics" />
            <DummyCard title="Recent Activity" />
            <DummyCard title="Performance" />
            <DummyCard title="Analytics" />
          </div>
          
          {/* Right column with grid */}
          <div className="w-1/3">
            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <DataGrid 
                onChange={handleChange}
                value={gridData}
                height={352}
                className="bg-white"
                title="Layer Config"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Example