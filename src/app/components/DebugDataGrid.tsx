import { useState, useRef, useEffect } from 'react'
import {
    DataSheetGrid,
    textColumn,
    keyColumn,
    intColumn,
    createTextColumn,
    AddRowsComponentProps
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/style.css'
import { logger } from '@/app/utils/logger'

export interface LayerData {
  layer: number;
  spread: string;
  max_waves: number;
  filled_waves: number;
}

// Create a custom text column with right alignment
const rightAlignedTextColumn = createTextColumn<string>({
  alignRight: true,
  parseUserInput: (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  },
  formatBlurredInput: (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  },
  formatInputOnFocus: (value) => value,
  formatForCopy: (value) => value,
  parsePastedValue: (value) => {
    const num = Number(value.trim());
    return isNaN(num) ? "0.00" : num.toFixed(2);
  },
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

interface DebugDataGridProps {
  onChange?: (data: LayerData[]) => void;
  className?: string;
  height?: number;
  title?: string;
  value: LayerData[];
}

interface ExtendedAddRowsProps extends AddRowsComponentProps {
  deleteLastRow?: () => void;
}

const CompactAddRow = ({ addRows, deleteLastRow }: ExtendedAddRowsProps) => (
  <div className="px-2 py-1 flex justify-between items-center">
    <button 
      onClick={() => addRows(1)}
      className="text-xs text-gray-600 hover:text-gray-800 transition-all duration-150 hover:scale-110"
    >
      + Add row
    </button>
    <button 
      className="text-xs text-gray-600 hover:text-red-600 transition-all duration-150 hover:scale-110"
      onClick={() => deleteLastRow && deleteLastRow()}
    >
      - Delete row
    </button>
  </div>
);

export const DebugDataGrid = ({ 
  onChange,
  className = '',
  height = 400,
  title,
  value
}: DebugDataGridProps) => {
  // Clear logs when component mounts
  useEffect(() => {
    logger.clear();
    logger.log('DebugDataGrid: Component mounted');
  }, []);

  logger.log('DebugDataGrid: rendering with value length:', value.length);
  
  // Keep track of the latest value
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
    logger.log('DebugDataGrid: valueRef updated:', { 
      newLength: value.length, 
      firstRow: value[0],
      lastRow: value[value.length - 1] 
    });
  }, [value]);

  const columns = [
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
  ];

  const handleChange = (newData: Record<string, any>[], operations: any[]) => {
    logger.log('DebugDataGrid: handleChange called with:', { 
      newDataLength: newData.length,
      operations,
      currentValueLength: valueRef.current.length
    });

    const formattedData = newData.map((row, index) => ({
      ...row,
      layer: index + 1,
      spread: row.spread,
      max_waves: Number(row.max_waves),
      filled_waves: Number(row.filled_waves),
    })) as LayerData[];
    
    logger.log('DebugDataGrid: calling parent onChange with:', {
      formattedDataLength: formattedData.length,
      firstRow: formattedData[0],
      lastRow: formattedData[formattedData.length - 1]
    });

    onChange?.(formattedData);
  };

  const handleDeleteLastRow = () => {
    const currentValue = valueRef.current;
    logger.log('DebugDataGrid: Delete last row clicked:', {
      currentLength: currentValue.length,
      lastRow: currentValue[currentValue.length - 1]
    });

    if (currentValue.length > 0) {
      const newData = currentValue.slice(0, -1);
      logger.log('DebugDataGrid: About to call handleChange:', {
        newDataLength: newData.length,
        operation: {
          type: 'DELETE',
          fromRowIndex: currentValue.length - 1,
          toRowIndex: currentValue.length - 1
        }
      });

      handleChange(newData, [{
        type: 'DELETE',
        fromRowIndex: currentValue.length - 1,
        toRowIndex: currentValue.length - 1
      }]);
    }
  };

  return (
    <div className={`rounded-md border ${className}`}>
      {title && <h2 className="text-sm font-medium px-3 py-2">{title}</h2>}
      <style>{headerStyle}</style>
      <DataSheetGrid
        value={value}
        onChange={handleChange}
        columns={columns}
        rowHeight={32}
        headerRowHeight={32}
        height={height}
        addRowsComponent={(props) => (
          <CompactAddRow 
            {...props} 
            deleteLastRow={handleDeleteLastRow}
          />
        )}
        createRow={() => ({
          layer: value.length + 1,
          spread: "0.00",
          max_waves: 0,
          filled_waves: 0
        })}
      />
    </div>
  );
}; 