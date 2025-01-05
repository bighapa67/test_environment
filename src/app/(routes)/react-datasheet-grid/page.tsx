'use client'

import { useState } from 'react'
import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
    keyColumn,
} from 'react-datasheet-grid'
  
  // Import the style only once in your app!
  import 'react-datasheet-grid/dist/style.css'
  
  interface RowData {
    layer: number;
    spread: number;
    max_waves: number;
    filled_waves: number;
  }
  
  const Example = () => {
    const [ data, setData ] = useState<RowData[]>([
      { layer: 1, spread: 0.50, max_waves: 5, filled_waves: 5 },
      { layer: 2, spread: 0.75, max_waves: 5, filled_waves: 2 },
    ])
  
    const columns = [
      { ...keyColumn('layer', textColumn), title: 'Layer' },
      { ...keyColumn('spread', textColumn), title: 'Spread' },
      { ...keyColumn('max_waves', textColumn), title: 'Max Waves' },
      { ...keyColumn('filled_waves', textColumn), title: 'Filled Waves' },
    ]
  
    const handleChange = (newData: Record<string, any>[], operations: any[]) => {
      setData(newData as RowData[])
    }
  
    return (
      <DataSheetGrid
        value={data}
        onChange={handleChange}
        columns={columns}
      />
    )
  }

  export default Example