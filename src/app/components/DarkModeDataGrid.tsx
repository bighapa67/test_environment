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

// CSS for light/dark mode
const createStyles = (isDarkMode: boolean) => `
  .dsg-container {
    background: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
    color: ${isDarkMode ? '#ffffff' : '#000000'};
    border-color: ${isDarkMode ? '#404040' : '#e5e7eb'};
  }

  /* Specific styling for Add row button; including hover animation color */
  .add-row-btn:hover {
    color: #22c55e !important;
  }

  .dsg-cell {
    background: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
    color: ${isDarkMode ? '#ffffff' : '#000000'};
    border-color: ${isDarkMode ? '#404040' : '#e5e7eb'} !important;
  }

  .dsg-cell-header {
    background: ${isDarkMode ? '#262626' : '#f9fafb'};
    color: ${isDarkMode ? '#ffffff' : '#374151'};
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dsg-cell-header-container {
    padding: 0;
    text-align: center;
    width: 100%;
  }

  .dsg-input {
    background: ${isDarkMode ? '#262626' : '#ffffff'};
    color: ${isDarkMode ? '#ffffff' : '#000000'};
  }

  .dsg-input:focus {
    background: ${isDarkMode ? '#333333' : '#ffffff'};
    color: ${isDarkMode ? '#ffffff' : '#000000'};
  }

  .dsg-row-selector {
    background: ${isDarkMode ? '#262626' : '#f9fafb'};
    border-color: ${isDarkMode ? '#404040' : '#e5e7eb'};
  }

  .dsg-row-selector:hover {
    background: ${isDarkMode ? '#333333' : '#f3f4f6'};
  }

  /* Bottom controls styles */
  .dsg-footer {
    background: ${isDarkMode ? '#1a1a1a' : '#ffffff'} !important;
    border-top: 1px solid ${isDarkMode ? '#404040' : '#e5e7eb'};
  }

  .dsg-add-row {
    background: ${isDarkMode ? '#1a1a1a' : '#ffffff'} !important;
  }

  /* Target the add/delete buttons specifically */
  .dsg-footer .dsg-add-row button {
    color: ${isDarkMode ? '#9ca3af' : '#4b5563'};
  }

  .dsg-footer .dsg-add-row button:hover {
    color: ${isDarkMode ? '#ef4444' : '#1f2937'} !important;
    transform: scale(1.1);
    transition: all 150ms;
  }
`;

interface DataGridProps {
  onChange?: (data: LayerData[]) => void;
  className?: string;
  height?: number;
  title?: string;
  value: LayerData[];  // Make value required since we're fully controlled
  isDarkMode?: boolean;
}

interface ExtendedAddRowsProps extends AddRowsComponentProps {
  deleteLastRow?: () => void;
  isDarkMode?: boolean;
}

const CompactAddRow = ({ addRows, deleteLastRow, isDarkMode }: ExtendedAddRowsProps) => (
  <div className={`px-2 py-1 flex justify-between items-center`}>
    <button 
      onClick={() => addRows(1)}
      className={`text-xs add-row-btn ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} 
                 transition-all duration-150 hover:scale-110`}
    >
      + Add row
    </button>
    <button 
      className={`text-xs ${isDarkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} 
                 transition-all duration-150 hover:scale-110`}
      onClick={() => deleteLastRow && deleteLastRow()}
    >
      - Delete row
    </button>
  </div>
);

export const DarkModeDataGrid = ({ 
  onChange,
  className = '',
  height = 400,
  title,
  value,
  isDarkMode = false
}: DataGridProps) => {
  console.log('DataGrid: rendering with value length:', value.length);
  
  // Keep track of the latest value
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const columns = [
    { 
      ...keyColumn('spread', rightAlignedTextColumn), 
      title: 'SpreadLevel'
    },
    { 
      ...keyColumn('max_waves', intColumn), 
      title: 'MaxWaves'
    },
    { 
      ...keyColumn('filled_waves', intColumn), 
      title: 'FilledWaves'
    },
  ];

  const handleChange = (newData: Record<string, any>[], operations: any[]) => {
    console.log('DataGrid: handleChange called with:', { 
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
    
    console.log('DataGrid: calling parent onChange with length:', formattedData.length);
    onChange?.(formattedData);
  };

  const handleDeleteLastRow = () => {
    const currentValue = valueRef.current;
    console.log('DataGrid: Delete last row clicked, current value length:', currentValue.length);
    if (currentValue.length > 0) {
      const newData = currentValue.slice(0, -1);
      console.log('DataGrid: About to call handleChange with newData length:', newData.length);
      handleChange(newData, [{
        type: 'DELETE',
        fromRowIndex: currentValue.length - 1,
        toRowIndex: currentValue.length - 1
      }]);
    }
  };

  return (
    <div className={`rounded-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${className}`}>
      {title && (
        <h2 className={`text-sm font-medium px-3 py-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          {title}
        </h2>
      )}
      <style>{createStyles(isDarkMode)}</style>
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
            isDarkMode={isDarkMode}
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