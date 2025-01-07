'use client'

import { useState } from 'react'
import { DebugDataGrid, LayerData } from '@/app/components/DebugDataGrid'

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

const DebugPage = () => {
  const [gridData, setGridData] = useState<LayerData[]>(defaultData);

  const handleChange = (data: LayerData[]) => {
    setGridData(data);
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-2 rounded-lg shadow-sm border">
          <DebugDataGrid 
            onChange={handleChange}
            value={gridData}
            height={352}
            className="bg-white"
            title="Debug Grid"
          />
        </div>
      </div>
    </div>
  )
}

export default DebugPage 