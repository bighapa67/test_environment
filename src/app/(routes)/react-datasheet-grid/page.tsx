'use client'

import { useState } from 'react'
import {
    DataSheetGrid,
    textColumn,
    keyColumn,
    intColumn,
    createTextColumn,
} from 'react-datasheet-grid'
  
// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'
  
interface RowData {
  layer: number;
  spread: string;
  max_waves: number;
  filled_waves: number;
}

// Create a custom text column with right alignment
const rightAlignedTextColumn = createTextColumn<string>({
  alignRight: true,
  // When user types or pastes, convert to number and format
  parseUserInput: (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  },
  // When cell loses focus, ensure 2 decimal places
  formatBlurredInput: (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  },
  // When cell gains focus, show the raw value
  formatInputOnFocus: (value) => value,
  // When copying, show formatted value
  formatForCopy: (value) => value,
  // When pasting, parse and format
  parsePastedValue: (value) => {
    const num = Number(value.trim());
    return isNaN(num) ? "0.00" : num.toFixed(2);
  },
  // When deleting, use "0.00"
  deletedValue: "0.00",
});

// CSS for centered header cells
const headerStyle = `
  .dsg-cell.dsg-cell-header {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dsg-cell-header-container {
    padding: 0;
    text-align: center;
    width: 100%;
  }
`;
  
const Example = () => {
  const [data, setData] = useState<RowData[]>([
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
  ])
  
  const columns = [
    { 
      ...keyColumn('layer', intColumn), 
      title: 'Layer'
    },
    { 
      ...keyColumn('spread', rightAlignedTextColumn), 
      title: 'Spread'
    },
    { 
      ...keyColumn('max_waves', intColumn), 
      title: 'Max Waves'
    },
    { 
      ...keyColumn('filled_waves', intColumn), 
      title: 'Filled Waves'
    },
  ]
  
  const handleChange = (newData: Record<string, any>[], operations: any[]) => {
    const formattedData = newData.map(row => ({
      ...row,
      layer: Number(row.layer),
      spread: row.spread, // No need to format here, it's handled by the column
      max_waves: Number(row.max_waves),
      filled_waves: Number(row.filled_waves),
    }))
    setData(formattedData as RowData[])
  }
  
  return (
    <div className="p-4">
      <style>{headerStyle}</style>
      <DataSheetGrid
        value={data}
        onChange={handleChange}
        columns={columns}
        rowHeight={35}
        headerRowHeight={40}
        height={400}
      />
    </div>
  )
}

export default Example