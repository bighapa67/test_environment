# React Datasheet Grid Documentation

This is a documentation file for the [react-datasheet-grid](https://github.com/nick-keller/react-datasheet-grid) package.

## Basic Usage

```tsx
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid'

const Example = () => {
  const [data, setData] = useState([
    { firstName: 'John', lastName: 'Doe' },
    { firstName: 'Jane', lastName: 'Doe' },
  ])

  const columns = [
    { ...keyColumn('firstName', textColumn), title: 'First name' },
    { ...keyColumn('lastName', textColumn), title: 'Last name' },
  ]

  return (
    <DataSheetGrid
      value={data}
      onChange={setData}
      columns={columns}
    />
  )
}
```

## Available Column Types

- `textColumn`: For text input
- `checkboxColumn`: For boolean values
- `floatColumn`: For decimal numbers
- `intColumn`: For integer numbers
- `isoDateColumn`: For dates in ISO format
- `progressColumn`: For progress bars
- `selectColumn`: For dropdown selections

## Column Configuration

Columns can be configured with various options:

```tsx
const columns = [
  {
    ...keyColumn('fieldName', textColumn),
    title: 'Column Title',
    disabled: false, // Make column read-only
    minWidth: 100, // Minimum column width
    width: '1fr', // Column width (can use fr units)
    renderCell: (props) => <CustomCell {...props} />, // Custom cell renderer
    renderHeader: (props) => <CustomHeader {...props} />, // Custom header renderer
  }
]
```

## Column Types and Options

### Text Column
```tsx
textColumn({
  placeholder: 'Enter text...',
  deleteValue: '', // Value when cell is cleared
  alignRight: false,
})
```

### Number Columns
```tsx
floatColumn({
  precision: 2, // Number of decimal places
  thousandSeparator: ',',
  decimalSeparator: '.',
  alignRight: true,
})

intColumn({
  thousandSeparator: ',',
  alignRight: true,
})
```

### Select Column
```tsx
selectColumn({
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ],
})
```

## Grid Props

The `DataSheetGrid` component accepts these props:

```tsx
<DataSheetGrid
  value={data} // Data array
  onChange={handleChange} // Change handler
  columns={columns} // Column definitions
  height={400} // Fixed height in pixels
  rowHeight={40} // Height of each row
  headerHeight={40} // Height of the header
  gutterColumn // Show gutter column
  disableSelect // Disable cell selection
  disabled // Make entire grid read-only
  addRowsComponent // Custom component for adding rows
  createRow={() => ({ field: 'value' })} // Function to create new rows
/>
```

## Styling

The grid can be styled using CSS. Import the default styles:

```tsx
import 'react-datasheet-grid/dist/style.css'
```

Custom styling can be applied using CSS classes:

```css
.dsg-container {
  /* Grid container */
}

.dsg-row {
  /* Grid rows */
}

.dsg-cell {
  /* Grid cells */
}
```

## TypeScript Support

The package includes TypeScript definitions. You can type your data and columns:

```tsx
interface RowData {
  field1: string;
  field2: number;
}

const columns: Column<RowData>[] = [
  // ...column definitions
]
```

## Performance Considerations

- Use `React.memo` for custom cell renderers
- Avoid unnecessary re-renders by memoizing column definitions
- Consider virtualizing large datasets using the height prop 