'use client'

import { useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface RowData {
  layer: number
  spread: number
  total_waves: number
  filled_waves: number
}

const GridPage = () => {
  const [data, setData] = useState<RowData[]>([
    { layer: 1, spread: 0.50, total_waves: 5, filled_waves: 5 },
    { layer: 2, spread: 0.75, total_waves: 5, filled_waves: 2 },
  ])
  const [editingValue, setEditingValue] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{row: number, column: keyof RowData} | null>(null)

  const columnHelper = createColumnHelper<RowData>()

  const finishEditing = (value: string, row: number, column: keyof RowData) => {
    const newData = [...data]
    const numValue = value.trim() === '' ? 0 : Number(value)
    const finalValue = isNaN(numValue) ? 0 : numValue
    
    if (column === 'spread') {
      newData[row][column] = Number(finalValue.toFixed(2))
    } else {
      newData[row][column] = finalValue
    }
    
    setData(newData)
    setEditingValue(null)
    setEditingCell(null)
  }

  const columns = [
    columnHelper.accessor('layer', {
      header: 'Layer',
      cell: info => (
        <div className="w-full h-full">
          <input 
            value={editingCell?.row === info.row.index && editingCell.column === 'layer' 
              ? editingValue ?? ''
              : info.getValue()}
            onChange={e => {
              setEditingValue(e.target.value)
            }}
            onFocus={e => {
              setEditingCell({ row: info.row.index, column: 'layer' })
              setEditingValue(String(info.getValue()))
              e.target.select()
            }}
            onBlur={e => {
              if (editingValue !== null) {
                finishEditing(editingValue, info.row.index, 'layer')
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="w-full p-1 border rounded font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            inputMode="numeric"
          />
        </div>
      )
    }),
    columnHelper.accessor('spread', {
      header: 'Spread',
      cell: info => (
        <div className="w-full h-full">
          <input 
            value={editingCell?.row === info.row.index && editingCell.column === 'spread'
              ? editingValue ?? ''
              : info.getValue().toFixed(2)}
            onChange={e => {
              setEditingValue(e.target.value)
            }}
            onFocus={e => {
              setEditingCell({ row: info.row.index, column: 'spread' })
              setEditingValue(String(info.getValue()))
              e.target.select()
            }}
            onBlur={e => {
              if (editingValue !== null) {
                finishEditing(editingValue, info.row.index, 'spread')
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="w-full p-1 border rounded font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            inputMode="decimal"
          />
        </div>
      )
    }),
    columnHelper.accessor('total_waves', {
      header: 'Total Waves',
      cell: info => (
        <div className="w-full h-full">
          <input 
            value={editingCell?.row === info.row.index && editingCell.column === 'total_waves'
              ? editingValue ?? ''
              : info.getValue()}
            onChange={e => {
              setEditingValue(e.target.value)
            }}
            onFocus={e => {
              setEditingCell({ row: info.row.index, column: 'total_waves' })
              setEditingValue(String(info.getValue()))
              e.target.select()
            }}
            onBlur={e => {
              if (editingValue !== null) {
                finishEditing(editingValue, info.row.index, 'total_waves')
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="w-full p-1 border rounded font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            inputMode="numeric"
          />
        </div>
      )
    }),
    columnHelper.accessor('filled_waves', {
      header: 'Filled Waves',
      cell: info => (
        <div className="w-full h-full">
          <input 
            value={editingCell?.row === info.row.index && editingCell.column === 'filled_waves'
              ? editingValue ?? ''
              : info.getValue()}
            onChange={e => {
              setEditingValue(e.target.value)
            }}
            onFocus={e => {
              setEditingCell({ row: info.row.index, column: 'filled_waves' })
              setEditingValue(String(info.getValue()))
              e.target.select()
            }}
            onBlur={e => {
              if (editingValue !== null) {
                finishEditing(editingValue, info.row.index, 'filled_waves')
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="w-full p-1 border rounded font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            inputMode="numeric"
          />
        </div>
      )
    })
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="container mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Portfolio Grid</h1>
      
      <div className="grid-container bg-white rounded-lg shadow-lg p-6">
        <div className="controls-section mb-4 space-x-4">
          <button 
            onClick={() => setData([...data, { layer: 0, spread: 0, total_waves: 0, filled_waves: 0 }])}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Row
          </button>
          <button 
            onClick={() => setData([])}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid-section mb-6 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="border p-2 bg-gray-50 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="border p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="summary-section bg-gray-50 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Portfolio Summary</h3>
          <p className="text-gray-700">Total Positions: {data.length}</p>
        </div>
      </div>
    </div>
  )
}

export default GridPage
